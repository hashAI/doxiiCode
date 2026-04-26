#!/usr/bin/env python3
"""
Design search functionality for component library integration.
Provides semantic search capabilities using OpenAI embeddings and MongoDB.
"""

import json
import logging
import os
from datetime import datetime
from typing import Dict, List

# Dependencies for MongoDB and semantic search

import numpy as np
from pymongo import MongoClient
import openai
from dotenv import load_dotenv

SEMANTIC_SEARCH_AVAILABLE = True

logger = logging.getLogger(__name__)


class DateTimeEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles datetime objects"""

    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


def get_mongo_connection():
    """Get MongoDB connection for component library"""
    # Load environment variables from local .env
    load_dotenv()

    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("COMPONENT_DB_NAME", "component-library-tool")
    COLLECTION_NAME = os.getenv("COMPONENT_COLLECTION_NAME", "component_library")

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    return db[COLLECTION_NAME]


def search_components_semantic(query: str, limit: int = 2) -> List[Dict]:
    """
    Semantic search function using embeddings
    """
    if not SEMANTIC_SEARCH_AVAILABLE:
        return []

    try:
        # Get OpenAI API key
        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key:
            logger.error("OpenAI API key not found")
            return []

        # Generate query embedding
        client_ai = openai.OpenAI(api_key=openai_key)
        response = client_ai.embeddings.create(model="text-embedding-3-small", input=query, encoding_format="float")
        query_embedding = response.data[0].embedding

        # Connect to MongoDB
        collection = get_mongo_connection()

        # Get all components with embeddings
        cursor = collection.find(
            {"status": "published", "aiEmbedding": {"$exists": True}, "designSystemProfile": {"$exists": True}}
        )
        components = list(cursor)

        # Calculate similarities
        results = []
        for component in components:
            embedding = component.get("aiEmbedding", [])
            if embedding:
                # Calculate cosine similarity
                a_np = np.array(query_embedding)
                b_np = np.array(embedding)
                similarity = np.dot(a_np, b_np) / (np.linalg.norm(a_np) * np.linalg.norm(b_np))

                # Clean up MongoDB ObjectId
                if "_id" in component:
                    del component["_id"]

                results.append({"component": component, "similarity": similarity})

        # Sort by similarity (highest first) and return top results
        results.sort(key=lambda x: x["similarity"], reverse=True)

        # Take top results
        semantic_results = [result["component"] for result in results[:limit]]

        logger.info(f"Found {len(semantic_results)} components for query: '{query}'")
        return semantic_results

    except Exception as e:
        logger.error(f"Error in semantic search: {e}")
        return []


def design_search_tool_func(query: str) -> str:
    """
    Design search tool using semantic search from component library
    Returns raw JSON data of components for AI to process
    """
    if not SEMANTIC_SEARCH_AVAILABLE:
        return json.dumps(
            {"error": "Design search is not available. Please ensure MongoDB and OpenAI dependencies are installed."},
            cls=DateTimeEncoder,
        )

    try:
        # Use semantic search with embeddings
        components = search_components_semantic(query, limit=3)

        if not components:
            return json.dumps(
                {"query": query, "designProfiles": [], "message": "No components found in the library for this query."},
                cls=DateTimeEncoder,
            )

        # Extract designSystemProfile and aiDescription from each component
        design_profiles = []
        for component in components:
            profile = component.get("designSystemProfile", {})
            # html_code = component.get("htmlCode", "")
            ai_summary = component.get("aiDescription", "")
            profile_with_context = {
                "name": component.get("name", "Unknown Component"),
                "category": component.get("category", "uncategorized"),
                "aiDescription": ai_summary,
                # "htmlCode": html_code,
                "designSystemProfile": profile,
            }
            design_profiles.append(profile_with_context)

        result = {"query": query, "designProfiles": design_profiles, "count": len(design_profiles)}

        return json.dumps(result, indent=2, cls=DateTimeEncoder)

    except Exception as e:
        logger.error(f"Error in design_search_tool: {e}")
        return json.dumps(
            {"error": f"Error searching for design inspiration: {str(e)}", "query": query}, cls=DateTimeEncoder
        )


# For independent testing
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Test design search functionality")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--limit", type=int, default=5, help="Number of results to return")
    args = parser.parse_args()

    # Set up logging for testing
    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(name)s | %(message)s")

    print(f"Testing design search for query: '{args.query}'")
    result = design_search_tool_func(args.query)
    print("Result:")
    print(result)
