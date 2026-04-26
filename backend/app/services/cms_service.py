import logging
import httpx
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class CMSService:
    def __init__(self):
        self.base_url = settings.CMS_BASE_URL

    async def check_database_exists(self, tenant_id: str) -> bool:
        """Check if database exists for the given tenant ID"""
        try:
            url = f"{self.base_url}/internal/database/{tenant_id}/status"
            headers = {"Content-Type": "application/json"}

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, timeout=30)

            if response.status_code == 200:
                data = response.json()
                return data.get("exists", False)
            else:
                logger.warning(f"Database status check failed for {tenant_id}: {response.status_code}")
                return False

        except Exception as e:
            logger.error(f"Error checking database existence for {tenant_id}: {e}")
            return False

    async def create_database(self, tenant_id: str) -> Dict[str, Any]:
        """Create a new database for the given tenant ID"""
        try:
            url = f"{self.base_url}/internal/database/"
            headers = {"Content-Type": "application/json"}
            payload = {"databaseId": tenant_id}

            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers, timeout=30)

            if response.status_code == 200:
                data = response.json()
                logger.info(f"Database created successfully for tenant {tenant_id}")
                return {"success": True, "data": data}
            else:
                logger.error(f"Database creation failed for {tenant_id}: {response.status_code} - {response.text}")
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}

        except Exception as e:
            logger.error(f"Error creating database for {tenant_id}: {e}")
            return {"success": False, "error": str(e)}

    async def upload_csv_data(self, tenant_id: str, csv_content: str) -> Dict[str, Any]:
        """Upload CSV data to the tenant's database"""
        try:
            url = f"{self.base_url}/admin/tenant/{tenant_id}/products/import/csv?import_mode=upsert"

            # Create a file-like object from the CSV content
            files = {"csv_file": ("products.csv", csv_content, "text/csv")}

            async with httpx.AsyncClient() as client:
                response = await client.post(url, files=files, timeout=60)

            if response.status_code == 200:
                result = response.json()
                logger.info(f"CSV upload successful for tenant {tenant_id}: {result}")
                return {"success": True, "data": result}
            else:
                logger.error(f"CSV upload failed for {tenant_id}: {response.status_code} - {response.text}")
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}

        except Exception as e:
            logger.error(f"Error uploading CSV for {tenant_id}: {e}")
            return {"success": False, "error": str(e)}

cms_service = CMSService()
