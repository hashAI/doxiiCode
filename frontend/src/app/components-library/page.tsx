"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ExternalLink, X, Share2, Check } from "lucide-react";

interface Component {
  id: string;
  name: string;
  category: string;
  variant: number;
  file_path: string;
  element_tag: string;
  description: string;
  features: string[];
  style_tags: string[];
  complexity?: string;
  mobile_friendly?: boolean;
  dark_mode_support?: boolean;
  use_cases?: string[];
}

interface Category {
  count: number;
  description: string;
}

export default function ComponentLibraryPage() {
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingComponents, setLoadingComponents] = useState<Set<string>>(new Set());
  const [copiedComponentId, setCopiedComponentId] = useState<string | null>(null);

  // Fetch catalog on mount
  useEffect(() => {
    fetchCatalog();
  }, []);

  // Filter components when search or category changes
  useEffect(() => {
    filterComponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, components]);

  const fetchCatalog = async () => {
    try {
      const response = await fetch("http://localhost:8010/api/components/catalog");
      const data = await response.json();
      setComponents(data.components || []);
      setCategories(data.categories || {});
      setLoading(false);
    } catch (error) {
      console.error("Error fetching catalog:", error);
      setLoading(false);
    }
  };

  const filterComponents = () => {
    let filtered = components;

    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.features.some((f) => f.toLowerCase().includes(query)) ||
          c.style_tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    setFilteredComponents(filtered);
  };

  const handleComponentClick = (componentId: string) => {
    router.push(`/components-library/${componentId}`);
  };

  const getViewUrl = (filePath: string): string => {
    // Extract path from component_library/components/heroes/hero-dome-lamp/hero-dome-lamp.js
    // to heroes/hero-dome-lamp/hero-dome-lamp.js
    const pathMatch = filePath.match(/component_library\/components\/(.+)/);
    if (pathMatch) {
      const componentPath = pathMatch[1];
      const baseUrl = window.location.origin;
      return `${baseUrl}/view/${componentPath}`;
    }
    return window.location.href;
  };

  const handleShare = async (component: Component, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const url = getViewUrl(component.file_path);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedComponentId(component.id);
      setTimeout(() => setCopiedComponentId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };






  // Listen for messages from component preview iframes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "component-loaded") {
        console.log("Component loaded:", event.data.elementTag);
        // Remove from loading state
        setLoadingComponents(prev => {
          const newSet = new Set(prev);
          // Find component by elementTag and remove it
          components.forEach(comp => {
            if (comp.element_tag === event.data.elementTag) {
              newSet.delete(comp.id);
            }
          });
          return newSet;
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [components]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      headers: "bg-blue-100 text-blue-800",
      footers: "bg-green-100 text-green-800",
      navigation: "bg-purple-100 text-purple-800",
      "product-cards": "bg-pink-100 text-pink-800",
      "product-grids": "bg-orange-100 text-orange-800",
      "product-galleries": "bg-yellow-100 text-yellow-800",
      heroes: "bg-indigo-100 text-indigo-800",
      carts: "bg-red-100 text-red-800",
      filters: "bg-teal-100 text-teal-800",
      "category-displays": "bg-cyan-100 text-cyan-800",
      misc: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading component library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Component Library</h1>
              <p className="text-gray-600 mt-1">
                {components.length} production-ready components
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                v1.0.0
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {Object.keys(categories).length} Categories
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search components by name, features, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Categories */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-32 max-h-[calc(100vh-12rem)] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Categories</h2>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
                {categorySearchQuery && (
                  <button
                    onClick={() => setCategorySearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {Object.entries(categories)
                  .filter(([name]) =>
                    categorySearchQuery === "" ||
                    name.toLowerCase().replace("-", " ").includes(categorySearchQuery.toLowerCase())
                  )
                  .map(([name, info]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedCategory(name)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === name
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{name.replace("-", " ")}</span>
                      <span className="text-xs text-gray-500">{info.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredComponents.length} of {components.length} components
            </div>

            {/* Component Grid */}
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  onClick={() => handleComponentClick(component.id)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border-2 overflow-hidden border-transparent hover:border-blue-300"
                >
                  {/* Preview Thumbnail */}
                  <div className="h-48 bg-gray-50 border-b border-gray-100 relative overflow-hidden group">
                    {loadingComponents.has(component.id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-xs text-gray-500">Loading...</p>
                        </div>
                      </div>
                    )}
                    <iframe
                      src="http://localhost:8010/api/components/preview"
                      className="w-full h-full bg-white"
                      title={`${component.name} preview`}
                      onLoad={(e) => {
                        // Mark as loading
                        setLoadingComponents(prev => new Set([...prev, component.id]));

                        // Send component data to iframe after it loads
                        setTimeout(() => {
                          const iframe = e.target as HTMLIFrameElement;
                          if (iframe.contentWindow) {
                            iframe.contentWindow.postMessage(
                              {
                                type: "load-component",
                                elementTag: component.element_tag,
                                filePath: component.file_path,
                              },
                              "*"
                            );
                          }
                        }, 100);
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-gray-700">
                      {component.element_tag}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{component.name}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleShare(component, e)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy shareable view link"
                        >
                          {copiedComponentId === component.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Share2 className="h-4 w-4" />
                          )}
                        </button>
                        <a
                          href={`/components-library/${component.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Open in new tab"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                            component.category
                          )}`}
                        >
                          {component.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{component.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {component.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {component.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                          +{component.features.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {component.mobile_friendly && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Mobile
                          </span>
                        )}
                        {component.dark_mode_support && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Dark Mode
                          </span>
                        )}
                      </div>
                      {component.complexity && (
                        <span className="text-xs capitalize px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {component.complexity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {filteredComponents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No components found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

