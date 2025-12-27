# Contributing to Notes Azure App

Thank you for your interest in contributing to Notes Azure App! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

We welcome contributions of all kinds:
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Tests
- 🔧 Refactoring

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/yourusername/notes-azure-app.git
cd notes-azure-app
```

### 2. Set Up Development Environment

```bash
# Install .NET SDK 8.0
# Install Node.js 18+

# Restore backend dependencies
cd src/api
dotnet restore

# Install frontend dependencies
cd ../web
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 📝 Development Guidelines

### Code Style

**C# (Backend):**
- Follow C# coding conventions
- Use meaningful variable and method names
- Add XML documentation comments for public APIs
- Keep methods focused and small

**TypeScript (Frontend):**
- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add note tagging functionality
fix: Resolve file upload size limit issue
docs: Update API documentation
refactor: Simplify note service implementation
test: Add unit tests for note repository
```

### Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add comments for new code
   - Update API documentation

2. **Test Your Changes**
   ```bash
   # Test backend
   cd src/api
   dotnet test
   
   # Test frontend
   cd src/web
   npm test
   ```

3. **Ensure Code Quality**
   - Code compiles without errors
   - No linter warnings
   - Follows existing patterns

4. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Add screenshots if UI changes

## 🧪 Testing

### Backend Tests

```bash
cd src/api
dotnet test
```

### Frontend Tests

```bash
cd src/web
npm test
```

### Integration Tests

```bash
# Run end-to-end tests
cd tests
npm test
```

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Code is properly commented
- [ ] Commit messages are clear
- [ ] PR description is detailed

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - Detailed steps to reproduce
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Screenshots** - If applicable
6. **Environment** - OS, browser, versions

## 💡 Suggesting Features

Feature suggestions are welcome! Please:

1. Check if the feature already exists
2. Open an issue with the `enhancement` label
3. Describe the feature and use case
4. Discuss implementation approach

## 📚 Code of Conduct

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers
- ✅ Focus on constructive feedback
- ✅ Help others learn

### Unacceptable Behavior

- ❌ Harassment or discrimination
- ❌ Trolling or insulting comments
- ❌ Personal attacks
- ❌ Any other unprofessional conduct

## 🎯 Areas for Contribution

### High Priority

- [ ] Add unit tests
- [ ] Improve error handling
- [ ] Add loading states
- [ ] Enhance search functionality
- [ ] Add note categories/folders

### Medium Priority

- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Export notes to PDF
- [ ] Note sharing features
- [ ] Rich text editor

### Low Priority

- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Internationalization
- [ ] Additional file type support

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/yourusername/notes-azure-app/discussions)
- 🐛 [GitHub Issues](https://github.com/yourusername/notes-azure-app/issues)
- 📧 Email: your.email@example.com

## 🙏 Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!

---

**Happy Coding! 🚀**

