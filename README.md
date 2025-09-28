# ProjectTools

> A powerful CLI tool for managing development projects across multiple workspaces and profiles.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js->=22.14.0-green.svg)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/deans-bradley/project-tools)

ProjectTools (`pt`) is a command-line interface designed to streamline the management of development projects across different workspaces and profiles. Whether you're juggling multiple clients, working on different types of projects, or need to organize your development environment, ProjectTools provides the structure and flexibility you need.

## Features

- **Profile Management**: Create and switch between different development profiles
- **Workspace Organization**: Manage multiple workspaces for different project types
- **Configuration Management**: Centralized configuration with customizable settings
- **Project Tracking**: Keep track of all your development projects (coming soon)
- **Cross-platform**: Works on Windows, macOS, and Linux

## Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Commands](#-commands)
- [Configuration](#-configuration)
- [Examples](#-examples)
- [Development](#-development)
- [Contributing](#-contributing)
- [Changelog](#-changelog)
- [License](#-license)

## Installation

### Prerequisites

- Node.js >= 22.14.0
- npm (comes with Node.js)

### Install from NPM (Coming Soon)

```bash
npm install -g projecttools
```

### Install from Source

1. Clone the repository:
```bash
git clone https://github.com/deans-bradley/project-tools.git
cd project-tools
```

2. Install dependencies:
```bash
npm install
```

3. Link the package globally:
```bash
npm link
```

4. Verify installation:
```bash
pt hello
```

You should see:
```
ProjectTools is working!
Ready to manage your projects with ease!
```

## Quick Start

1. **Test your installation:**
```bash
pt hello
```

2. **Create your first profile:**
```bash
pt profile add work
```

3. **Create a workspace:**
```bash
pt workspace add frontend-projects
```

4. **Set your default projects path:**
```bash
pt config set default-path ~/projects
```

5. **View your configuration:**
```bash
pt config show
```

## Commands

### Global Commands

| Command     | Description                         |
|-------------|-------------------------------------|
| `pt`        | Show welcome message and usage info |
| `pt --help` | Display help for all commands       |
| `pt hello`  | Test command to verify installation |

### Profile Commands

Profiles help you organize different contexts (work, personal, client projects, etc.).

| Command | Description                                     |
|----------------------------|------------------------------|
| `pt profile add <name>`    | Create a new profile         |
| `pt profile list`          | List all profiles            |
| `pt profile switch <name>` | Switch to a specific profile |
| `pt profile remove <name>` | Remove a profile             |

### Workspace Commands

Workspaces are containers for related projects within a profile.

| Command                      | Description                         |
|------------------------------|-------------------------------------|
| `pt workspace add <name>`    | Create a new workspace              |
| `pt workspace list`          | List workspaces in current profile  |
| `pt workspace list -a`       | List all workspaces across profiles |
| `pt workspace remove <name>` | Remove a workspace                  |

### Configuration Commands

Manage your ProjectTools settings and preferences.

| Command                             | Description                    |
|-------------------------------------|--------------------------------|
| `pt config show`                    | Display current configuration  |
| `pt config set default-path <path>` | Set default projects directory |

### Project Commands

*Note: Project management features are coming in future releases.*

| Command      | Description                    |
|--------------|--------------------------------|
| `pt project` | Show project management status |

## Configuration

ProjectTools stores its configuration in a JSON file located at:
- **Windows**: `%USERPROFILE%\.projecttools\config.json`
- **macOS/Linux**: `~/.projecttools/config.json`

### Configuration Structure

```json
{
  "activeProfile": "work",
  "settings": {
    "defaultProjectsPath": "/Users/username/projects"
  },
  "profiles": [
    {
      "id": "uuid",
      "name": "work",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "workspaces": [
    {
      "id": "uuid",
      "name": "frontend-projects", 
      "profileId": "profile-uuid",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "projects": []
}
```

### Available Settings

| Setting        | Description                    | Example      |
|----------------|--------------------------------|--------------|
| `default-path` | Default directory for projects | `~/projects` |

## Examples

### Setting up a Work Profile

```bash
# Create a work profile
pt profile add work

# Create workspaces for different project types
pt workspace add client-websites
pt workspace add internal-tools
pt workspace add mobile-apps

# Set your projects directory
pt config set default-path ~/work-projects

# View your setup
pt config show
```

### Managing Multiple Profiles

```bash
# Create different profiles
pt profile add work
pt profile add personal
pt profile add freelance

# List all profiles
pt profile list

# Switch between profiles
pt profile switch personal
pt profile switch work

# Each profile maintains its own workspaces
pt workspace list -a  # See workspaces across all profiles
```

### Configuration Management

```bash
# View current configuration
pt config show

# Set default projects path
pt config set default-path /Users/john/development

# The configuration is automatically saved and loaded
```

## Development

### Prerequisites for Development

- Node.js >= 22.14.0
- npm

### Setting up Development Environment

1. Fork and clone the repository:
```bash
git clone https://github.com/deans-bradley/project-tools.git
cd project-tools
```

2. Install dependencies:
```bash
npm install
```

3. Link for local testing:
```bash
npm link
```

4. Run in development mode:
```bash
npm run dev
```

### Project Structure

```
project-tools/
├── bin/
│   └── pt.js              # CLI entry point
├── src/
│   ├── commands/          # Command definitions
│   │   ├── configCommands.js
│   │   ├── profileCommands.js
│   │   ├── projectCommands.js
│   │   └── workspaceCommands.js
│   ├── managers/          # Business logic managers
│   │   ├── ConfigManager.js
│   │   ├── ProfileManager.js
│   │   ├── ProjectManager.js
│   │   └── WorkspaceManager.js
│   └── utils/             # Utility functions
│       ├── commonUtils.js
│       ├── configUtils.js
│       └── pathUtils.js
├── config/
│   └── default.json       # Default configuration
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Update documentation as needed
- Ensure all commands work across platforms

## Acknowledgments

ProjectTools is built on the shoulders of excellent open-source libraries:

- **[Commander.js](https://github.com/tj/commander.js/)** (v14.0.0) - The complete solution for Node.js command-line interfaces. Powers our CLI framework with robust argument parsing and command structure.
- **[Chalk](https://github.com/chalk/chalk)** (v5.4.1) - Terminal string styling done right. Brings beautiful colors and formatting to our CLI output.
- **[fs-extra](https://github.com/jprichardson/node-fs-extra)** (v11.3.0) - Enhanced file system methods for Node.js. Provides reliable cross-platform file operations for configuration management.

Special thanks to the maintainers and contributors of these projects for making development more enjoyable and reliable.

## Changelog

### [0.1.0] - 2025-09-28

#### Added
- Initial release of ProjectTools CLI
- Profile management system with create, list, switch, and remove operations
- Workspace management with profile-scoped organization
- Basic configuration management with settings persistence
- Cross-platform configuration file handling
- Colorful CLI output with chalk styling
- Hello command for installation verification
- Comprehensive help system

#### Features
- **Profiles**: Create and manage development contexts
- **Workspaces**: Organize projects within profiles  
- **Configuration**: Centralized settings management
- **CLI Framework**: Built with Commander.js for robust command handling

#### Technical
- Node.js >= 22.14.0 requirement
- ES modules architecture
- JSON-based configuration storage
- Cross-platform file system operations

#### Coming Soon
- Project management features
- Enhanced workspace operations
- Project templates and scaffolding
- Integration with popular development tools

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Bradley Deans**
- GitHub: [@deans-bradley](https://github.com/deans-bradley)