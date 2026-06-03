"""
Directory structure configuration for Wedding Planner Multi-Agent Framework.
This module defines all required directories and provides utilities to manage them.
"""

import os
from pathlib import Path
from typing import Dict, List


class DirectoryConfig:
    """Centralized directory configuration for the application."""
    
    # Base directory
    BASE_DIR = Path(__file__).parent.parent
    
    # Core directories
    BACKEND_DIR = BASE_DIR / "backend"
    FRONTEND_DIR = BASE_DIR / "frontend"
    CONFIG_DIR = BASE_DIR / "config"
    DATA_DIR = BASE_DIR / "data"
    DOCS_DIR = BASE_DIR / "docs"
    TESTS_DIR = BASE_DIR / "tests"
    UTILS_DIR = BASE_DIR / "utils"
    MODELS_DIR = BASE_DIR / "models"
    ASSETS_DIR = BASE_DIR / "assets"
    
    # Multi-agent framework directories
    AGENTS_DIR = BASE_DIR / "agents"
    PROMPTS_DIR = BASE_DIR / "prompts"
    TOOLS_DIR = BASE_DIR / "tools"
    MCP_DIR = BASE_DIR / "mcp"
    LOGS_DIR = BASE_DIR / "logs"
    
    # Backend subdirectories
    BACKEND_APP_DIR = BACKEND_DIR / "app"
    
    # Data subdirectories
    DATABASE_DIR = DATA_DIR / "database"
    UPLOADS_DIR = DATA_DIR / "uploads"
    ATTACHMENTS_DIR = UPLOADS_DIR / "attachments"
    
    # Logs subdirectories
    AGENT_LOGS_DIR = LOGS_DIR / "agents"
    API_LOGS_DIR = LOGS_DIR / "api"
    MCP_LOGS_DIR = LOGS_DIR / "mcp"
    
    @classmethod
    def get_all_directories(cls) -> Dict[str, Path]:
        """Get all defined directories as a dictionary."""
        return {
            "base": cls.BASE_DIR,
            "backend": cls.BACKEND_DIR,
            "frontend": cls.FRONTEND_DIR,
            "config": cls.CONFIG_DIR,
            "data": cls.DATA_DIR,
            "docs": cls.DOCS_DIR,
            "tests": cls.TESTS_DIR,
            "utils": cls.UTILS_DIR,
            "models": cls.MODELS_DIR,
            "assets": cls.ASSETS_DIR,
            "agents": cls.AGENTS_DIR,
            "prompts": cls.PROMPTS_DIR,
            "tools": cls.TOOLS_DIR,
            "mcp": cls.MCP_DIR,
            "logs": cls.LOGS_DIR,
            "backend_app": cls.BACKEND_APP_DIR,
            "database": cls.DATABASE_DIR,
            "uploads": cls.UPLOADS_DIR,
            "attachments": cls.ATTACHMENTS_DIR,
            "agent_logs": cls.AGENT_LOGS_DIR,
            "api_logs": cls.API_LOGS_DIR,
            "mcp_logs": cls.MCP_LOGS_DIR,
        }
    
    @classmethod
    def ensure_directories_exist(cls) -> None:
        """Create all directories if they don't exist."""
        directories = cls.get_all_directories()
        
        for name, path in directories.items():
            if not path.exists():
                path.mkdir(parents=True, exist_ok=True)
                print(f"Created directory: {path}")
    
    @classmethod
    def get_path(cls, name: str) -> Path:
        """Get a specific directory path by name."""
        directories = cls.get_all_directories()
        if name not in directories:
            raise ValueError(f"Unknown directory: {name}")
        return directories[name]
    
    @classmethod
    def validate_structure(cls) -> List[str]:
        """Validate that all required directories exist.
        
        Returns:
            List of missing directory paths.
        """
        directories = cls.get_all_directories()
        missing = []
        
        for name, path in directories.items():
            if not path.exists():
                missing.append(str(path))
        
        return missing


def initialize_directories() -> None:
    """Initialize all required directories for the application."""
    print("Initializing directory structure...")
    DirectoryConfig.ensure_directories_exist()
    
    missing = DirectoryConfig.validate_structure()
    if missing:
        print(f"Warning: The following directories are still missing: {missing}")
    else:
        print("All directories initialized successfully.")


if __name__ == "__main__":
    initialize_directories()
