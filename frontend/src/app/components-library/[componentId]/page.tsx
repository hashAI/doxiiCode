"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Eye, Code, ArrowLeft, Smartphone, Tablet, Maximize, Minimize, Share2, Check } from "lucide-react";
import Link from "next/link";

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

export default function ComponentDetailPage() {
  const params = useParams();
  const componentId = params.componentId as string;

  const [component, setComponent] = useState<Component | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [componentCode, setComponentCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "full">("full");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadComponentPreview = useCallback(() => {
    // Send message to iframe to load component
    setTimeout(() => {
      const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
      if (iframe && iframe.contentWindow && component) {
        iframe.contentWindow.postMessage(
          {
            type: "load-component",
            elementTag: component.element_tag,
            filePath: component.file_path,
          },
          "*"
        );
      }
    }, 500);
  }, [component]);

  // Fetch component data
  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await fetch(`http://localhost:8010/api/components/component/${componentId}`);
        const data = await response.json();
        setComponent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching component:", error);
        setLoading(false);
      }
    };

    if (componentId) {
      fetchComponent();
    }
  }, [componentId]);

  // Load component preview when component is set
  useEffect(() => {
    if (component && showPreview) {
      loadComponentPreview();
    }
  }, [component, showPreview, loadComponentPreview]);

  // Note: We don't need to reload the component when viewport changes
  // The container resizing is handled by CSS/styling, and the component
  // should adapt to its container size automatically

  const fetchComponentCode = async () => {
    if (!component) return;

    try {
      const response = await fetch(
        `http://localhost:8010/api/components/component/${component.id}/code`
      );
      const data = await response.json();
      setComponentCode(data.code || "");
    } catch (error) {
      console.error("Error fetching component code:", error);
      setComponentCode("// Error loading code");
    }
  };

  const handleViewPreview = () => {
    setShowPreview(true);
    setShowCode(false);
    loadComponentPreview();
  };

  const handleViewCode = () => {
    if (component && !componentCode) {
      fetchComponentCode();
    }
    setShowCode(true);
    setShowPreview(false);
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

  const handleShare = async () => {
    if (!component) return;
    const url = getViewUrl(component.file_path);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Listen for messages from preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "component-loaded") {
        console.log("Component loaded:", event.data.elementTag);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Get viewport dimensions
  const getViewportDimensions = () => {
    switch (viewport) {
      case "mobile":
        return { width: 375, height: 667, name: "Mobile (375px)" };
      case "tablet":
        return { width: 768, height: 1024, name: "Tablet (768px)" };
      case "full":
        return { width: "100%", height: "100%", name: "Full Width" };
      default:
        return { width: "100%", height: "100%", name: "Full Width" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading component...</p>
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Component Not Found</h1>
          <p className="text-gray-600 mb-4">The requested component could not be found.</p>
          <Link
            href="/components-library"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className={`bg-white border-b border-gray-200 flex-shrink-0 transition-all ${isFullscreen ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and title */}
            <div className="flex items-center gap-3">
              <Link
                href="/components-library"
                className="inline-flex items-center gap-1.5 px-2 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{component.name}</h1>
                <p className="text-sm text-gray-600 hidden sm:block">{component.description}</p>
              </div>
            </div>

            {/* Right side - Share and Tab Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                title="Copy shareable link"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>
              <div className="flex gap-1">
                <button
                  onClick={handleViewPreview}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    showPreview
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Eye className="h-4 w-4 inline mr-1" />
                  Preview
                </button>
              <button
                onClick={() => {
                  setShowCode(false);
                  setShowPreview(false);
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  !showCode && !showPreview
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Details
              </button>
              <button
                onClick={handleViewCode}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  showCode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Code className="h-4 w-4 inline mr-1" />
                Code
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className={`${isFullscreen ? 'h-screen px-4 py-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'} h-full overflow-y-auto`}>
          {showPreview ? (
          <div className="flex flex-col h-full">
            {/* Viewport Controls */}
            <div className={`flex items-center justify-between mb-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm ${isFullscreen ? 'sticky top-0 z-10' : ''}`}>
              <div className="flex items-center gap-2">
                {isFullscreen && (
                  <>
                    <Link
                      href="/components-library"
                      className="inline-flex items-center gap-1.5 px-2 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors mr-2"
                      title="Back to Library"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm font-semibold text-gray-900 mr-2 hidden sm:inline">
                      {component.name}
                    </span>
                  </>
                )}
                <span className="text-sm font-medium text-gray-700 mr-2">Viewport:</span>
                <button
                  onClick={() => setViewport("mobile")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    viewport === "mobile"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
                <button
                  onClick={() => setViewport("tablet")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    viewport === "tablet"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet className="h-4 w-4" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  onClick={() => setViewport("full")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    viewport === "full"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="Full Width"
                >
                  <Maximize className="h-4 w-4" />
                  <span className="hidden sm:inline">Full</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 mr-2 hidden md:inline">
                  {getViewportDimensions().name}
                </span>
                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="h-4 w-4" />
                      <span className="hidden sm:inline">Exit</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="h-4 w-4" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Container */}
            <div
              className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden mx-auto transition-all duration-300"
              style={{
                width: viewport === "full" ? "100%" : `${getViewportDimensions().width}px`,
                height: isFullscreen ? "calc(100vh - 80px)" : viewport === "full" ? "calc(100vh - 160px)" : `${getViewportDimensions().height}px`,
                minHeight: viewport === "full" ? "400px" : "auto",
                maxWidth: viewport === "full" ? "100%" : "100%"
              }}
            >
              <iframe
                id="preview-iframe"
                src="http://localhost:8010/api/components/preview"
                className="w-full h-full bg-white"
                title="Component Preview"
                style={{
                  width: viewport === "full" ? "100%" : `${getViewportDimensions().width}px`,
                  height: "100%"
                }}
              />
            </div>
          </div>
        ) : !showCode ? (
          <div className="space-y-6">
            {/* Component Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Element Tag</h3>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                {component.element_tag}
              </code>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {component.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {component.use_cases && component.use_cases.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Use Cases</h3>
                <ul className="list-disc list-inside space-y-1">
                  {component.use_cases.map((useCase, idx) => (
                    <li key={idx} className="text-gray-700 text-sm">
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Style Tags</h3>
              <div className="flex flex-wrap gap-2">
                {component.style_tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Complexity</div>
                <div className="font-semibold capitalize">
                  {component.complexity || "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Mobile Friendly</div>
                <div className="font-semibold">
                  {component.mobile_friendly ? "Yes" : "No"}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Dark Mode</div>
                <div className="font-semibold">
                  {component.dark_mode_support ? "Yes" : "No"}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">File Path</h4>
              <code className="text-sm text-blue-700">{component.file_path}</code>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Component Source Code</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{componentCode || "Loading..."}</code>
              </pre>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
