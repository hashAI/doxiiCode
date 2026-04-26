"""
Pydantic models for inter-agent communication.

These models define the structured data formats used for communication
between the Architect (planner) and Developer (implementer) agents.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal, Any


class DesignSystem(BaseModel):
    """
    Complete design system specification created by the Architect.

    This defines the visual identity of the e-commerce store including
    colors, typography, spacing, and brand personality traits.
    """

    # Color palette
    primary_color: str = Field(
        description="Primary brand color (Tailwind class, e.g., 'amber-600')"
    )
    secondary_color: str = Field(
        description="Secondary accent color (Tailwind class)"
    )
    background_light: str = Field(
        default="bg-white",
        description="Light mode background color"
    )
    background_dark: str = Field(
        default="bg-gray-900",
        description="Dark mode background color"
    )
    text_light: str = Field(
        default="text-gray-900",
        description="Light mode text color"
    )
    text_dark: str = Field(
        default="text-white",
        description="Dark mode text color"
    )
    additional_colors: List[str] = Field(
        default_factory=list,
        description="Additional brand colors for accents"
    )

    # Typography
    heading_font: str = Field(
        description="Font family for headings (Tailwind class, e.g., 'font-serif')"
    )
    body_font: str = Field(
        description="Font family for body text (Tailwind class, e.g., 'font-sans')"
    )
    heading_weights: Dict[str, str] = Field(
        default={"h1": "font-bold", "h2": "font-semibold", "h3": "font-medium"},
        description="Font weights for different heading levels"
    )

    # Spacing
    section_spacing: str = Field(
        default="py-12",
        description="Vertical spacing between major sections"
    )
    container_width: str = Field(
        default="max-w-7xl",
        description="Max container width (Tailwind class)"
    )
    element_spacing: str = Field(
        default="gap-6",
        description="Spacing between elements in grids/flexbox"
    )

    # Brand personality
    personality_traits: List[str] = Field(
        description="Brand personality: luxury, minimal, bold, playful, professional, etc."
    )

    # Layout preferences
    layout_style: Literal["spacious", "compact", "standard"] = Field(
        default="standard",
        description="Overall layout density"
    )
    border_radius: str = Field(
        default="rounded-lg",
        description="Border radius style (Tailwind class)"
    )

    # Animation style
    animation_style: Literal["smooth", "snappy", "minimal", "none"] = Field(
        default="smooth",
        description="Animation timing and feel"
    )


class ComponentSpec(BaseModel):
    """
    Specification for a single component to be implemented.

    Defines which component from the library to use and how to customize it.
    """

    component_id: str = Field(
        description="Component ID from library (e.g., 'header-minimal', 'hero-split')"
    )
    element_tag: str = Field(
        description="Custom element tag name (e.g., 'header-classic', 'hero-section')"
    )
    customizations: Dict[str, str] = Field(
        default_factory=dict,
        description="Specific customizations beyond design system (optional)"
    )
    output_path: str = Field(
        description="Where to write the component file (e.g., 'components/header.js')"
    )


class PageSection(BaseModel):
    """
    Specification for a section within a page.

    Each page is composed of multiple sections, each using a specific component.
    """

    section_type: str = Field(
        description="Type of section (e.g., 'hero', 'products', 'features', 'cta')"
    )
    component_id: str = Field(
        description="Component ID to use for this section"
    )
    element_tag: str = Field(
        description="Custom element tag for this component"
    )
    props: Dict[str, Any] = Field(
        default_factory=dict,
        description="Props to pass to the component"
    )


class PageSpec(BaseModel):
    """
    Specification for a complete page to be built.

    Defines the page structure, sections, components, and routing.
    """

    page_name: str = Field(
        description="Page identifier (e.g., 'home', 'catalog', 'product-detail')"
    )
    output_path: str = Field(
        description="Where to write page file (e.g., 'pages/home.js')"
    )
    sections: List[PageSection] = Field(
        description="List of sections that compose this page"
    )
    route_path: str = Field(
        description="Route path for this page (e.g., '/', '/catalog', '/product/:id')"
    )
    requires_data: bool = Field(
        default=False,
        description="Whether this page requires product data from store"
    )


class DeveloperTask(BaseModel):
    """
    Complete task specification sent from Architect to Developer.

    The Developer receives this structured task and executes it, returning
    a DeveloperResult with the outcome.
    """

    task_type: Literal[
        "build_page",
        "create_components",
        "wire_routing",
        "populate_data",
        "fix_issue",
        "create_component_bundle"
    ] = Field(
        description="Type of task to perform"
    )

    task_description: str = Field(
        description="Human-readable description of the task"
    )

    project_path: str = Field(
        description="Root path of the project where files should be created"
    )

    # Task-specific fields (presence depends on task_type)
    page_spec: Optional[PageSpec] = Field(
        default=None,
        description="Page specification (required for build_page)"
    )

    component_specs: Optional[List[ComponentSpec]] = Field(
        default=None,
        description="List of components to create (for create_components)"
    )

    pages_list: Optional[List[PageSpec]] = Field(
        default=None,
        description="List of all pages for routing (required for wire_routing)"
    )

    product_count: Optional[int] = Field(
        default=12,
        description="Number of products to generate (for populate_data)"
    )

    business_type: Optional[str] = Field(
        default=None,
        description="Type of business for product generation (e.g., 'jewelry', 'books')"
    )

    issue_description: Optional[str] = Field(
        default=None,
        description="Description of issue to fix (for fix_issue)"
    )


class DeveloperResult(BaseModel):
    """
    Result returned by Developer agent after completing a task.

    Provides structured feedback to the Architect about what was accomplished
    and any issues encountered.
    """

    status: Literal["success", "partial", "failure"] = Field(
        description="Outcome of the task"
    )

    files_created: List[str] = Field(
        default_factory=list,
        description="List of files created (relative paths from project root)"
    )

    files_modified: List[str] = Field(
        default_factory=list,
        description="List of files modified (relative paths from project root)"
    )

    issues_encountered: List[str] = Field(
        default_factory=list,
        description="List of problems or warnings encountered during execution"
    )

    message: str = Field(
        description="Summary message describing the outcome"
    )

    can_proceed: bool = Field(
        default=True,
        description="Whether the Architect can safely proceed to next task"
    )

    components_created: List[str] = Field(
        default_factory=list,
        description="List of component names created (for tracking)"
    )


class ArchitectPlan(BaseModel):
    """
    Complete plan created by the Architect.

    This represents the Architect's high-level plan for the entire project,
    including design system, component selections, and page structures.

    Optional: Can be used for documentation or validation.
    """

    business_name: str = Field(
        description="Name of the business/store"
    )

    business_type: str = Field(
        description="Type of business (e.g., 'jewelry', 'bookstore', 'electronics')"
    )

    brand_personality: List[str] = Field(
        description="Brand personality traits"
    )

    design_system: DesignSystem = Field(
        description="Complete design system"
    )

    pages_planned: List[PageSpec] = Field(
        description="All pages planned for the project"
    )

    components_selected: List[ComponentSpec] = Field(
        description="All components selected from library"
    )

    estimated_file_count: int = Field(
        description="Estimated total number of files to be created"
    )
