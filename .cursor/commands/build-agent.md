# Build Agent

**Version**: 1.0  
**Purpose**: Production build validation, bundle analysis, and optimization recommendations

---

## Core Workflow

### Phase 1: Build Execution

**Objective**: Run production build and validate success

**Command**: `npm run build`

**Actions**:

1. Execute production build
2. Capture all output (stdout, stderr)
3. Monitor build time and memory usage
4. Validate build completes successfully
5. Collect generated bundle information

**Success Criteria**:

- Build completes without errors
- All assets generated
- No critical warnings

---

### Phase 2: Build Error Analysis

**If build fails**, categorize errors as:

**Fixable Build Errors**:

- ✅ Missing environment variables (can be set)
- ✅ Unused code causing tree-shaking issues
- ✅ Simple import errors
- ✅ Asset reference problems
- ✅ Configuration issues (minor)

**Complex Build Errors** (Requires Investigation):

- ❌ Third-party dependency issues
- ❌ Type errors from external libraries
- ❌ Complex module resolution issues
- ❌ Build tool configuration problems
- ❌ Circular dependencies
- ❌ Memory/performance issues during build

---

### Phase 3: Bundle Size Analysis

**Objective**: Analyze bundle size and identify optimization opportunities

**Actions**:

1. Measure total bundle size (gzipped and uncompressed)
2. Analyze chunk sizes
3. Identify large dependencies
4. Compare against previous builds (if baseline exists)
5. Identify optimization opportunities

**Bundle Size Metrics**:

```
Main Bundle Size: [size] KB (gzipped: [size] KB)
Vendor Bundle: [size] KB
CSS Bundle: [size] KB
Total Size: [size] KB

By Framework:
- React: [size] KB
- React DOM: [size] KB
- Other: [size] KB
```

---

### Phase 4: Dependency Analysis

**Objective**: Identify large or unnecessary dependencies

**Actions**:

1. List all dependencies by size
2. Identify duplicate dependencies
3. Check for unused dependencies
4. Identify opportunities for:
   - Tree-shaking improvements
   - Code splitting opportunities
   - Library alternatives
   - Dynamic imports

---

### Phase 5: Optimization Recommendations

**Generate recommendations based on analysis**:

**High Priority** (Quick wins, significant impact):

- ✅ Remove unused dependencies
- ✅ Enable/improve tree-shaking
- ✅ Add code splitting for lazy-loaded routes
- ✅ Optimize vendor bundle
- ✅ Remove duplicate dependencies
- ✅ Use smaller library alternatives

**Medium Priority** (Moderate effort, good impact):

- 🟡 Implement dynamic imports for heavy libraries
- 🟡 Compress images and assets
- 🟡 Implement route-based code splitting
- 🟡 Optimize CSS
- 🟡 Remove console logs and debug code

**Low Priority** (Minimal impact or complex):

- 🟢 Advanced minification techniques
- 🟢 Edge cases and micro-optimizations

---

### Phase 6: Report Generation

**DO NOT** create markdown files. Provide short summary to orchestrator:

**Output Format** (max 2 sentences):

```
✅ Pass - Build successful. Bundle size: 185 KB (58 KB gzipped), within acceptable range.

OR

⚠️ Bundle Size Warning - Build successful but main bundle increased to 220 KB (exceeds 200 KB threshold). Fix: Implement route-based code splitting or remove unused dependencies like moment.js (65 KB savings).

OR

🔴 Build Failed - Build failed with X errors. Fix: Resolve module resolution issues in vite.config.ts or fix circular dependencies.
```

---

### Phase 7: Build Health Assessment

**Determine overall build health**:

- ✅ **Healthy**: Build succeeds, size within acceptable range, no major warnings
- 🟡 **Acceptable**: Build succeeds, size slightly elevated, minor warnings
- 🔴 **Needs Attention**: Build fails OR size significantly increased OR critical warnings

---

## Configuration

### Build Settings

- **Command**: `npm run build`
- **Output Directory**: `dist/`
- **Target**: Production
- **Mode**: Optimized

### Bundle Size Thresholds

**Alert Levels**:

| Size                 | Status        | Action      |
| -------------------- | ------------- | ----------- |
| < 100 KB (gzipped)   | ✅ Excellent  | None        |
| 100-150 KB (gzipped) | 🟢 Good       | Monitor     |
| 150-200 KB (gzipped) | 🟡 Acceptable | Review      |
| > 200 KB (gzipped)   | 🔴 High       | Investigate |

### Build Performance Targets

- Build time: < 60 seconds
- Total size: < 500 KB (uncompressed)
- Gzipped size: < 150 KB

---

## Common Optimization Strategies

### 1. Code Splitting

```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
```

**Impact**: Reduces initial bundle by 30-40%

### 2. Tree-Shaking

- Use ES modules
- Avoid default exports
- Use named exports
- Ensure package.json has `sideEffects: false`

**Impact**: Reduces bundle by 15-25%

### 3. Dynamic Imports

```typescript
// Load heavy libraries on demand
const { Chart } = await import('chart.js')
```

**Impact**: Depends on usage patterns

### 4. Library Optimization

- Replace heavy libraries (moment → date-fns)
- Use lighter alternatives
- Remove duplicate dependencies
- Deduplicate versions

**Impact**: 20-50 KB per optimization

### 5. Asset Optimization

- Compress images
- Use modern formats (WebP)
- Lazy load images below fold
- Minify SVGs

**Impact**: 100-500 KB for image-heavy apps

---

## Success Criteria

✅ Build completes successfully  
✅ Bundle size analyzed and reported  
✅ Optimization recommendations provided  
✅ No critical build warnings  
✅ Report generated (if issues found)
