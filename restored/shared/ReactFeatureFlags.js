/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// -----------------------------------------------------------------------------
// Land or remove (zero effort)
//
// Flags that can likely be deleted or landed without consequences
// -----------------------------------------------------------------------------
// None
// -----------------------------------------------------------------------------
// Killswitch
//
// Flags that exist solely to turn off a change in case it causes a regression
// when it rolls out to prod. We should remove these as soon as possible.
// -----------------------------------------------------------------------------
var enableHydrationLaneScheduling = true; // -----------------------------------------------------------------------------
// Land or remove (moderate effort)
//
// Flags that can be probably deleted or landed, but might require extra effort
// like migrating internal callers or performance testing.
// -----------------------------------------------------------------------------
// TODO: Finish rolling out in www

var favorSafetyOverHydrationPerf = true; // Need to remove didTimeout argument from Scheduler before landing

var disableSchedulerTimeoutInWorkLoop = false; // -----------------------------------------------------------------------------
// Slated for removal in the future (significant effort)
//
// These are experiments that didn't work out, and never shipped, but we can't
// delete from the codebase until we migrate internal callers.
// -----------------------------------------------------------------------------
// Add a callback property to suspense to notify which promises are currently
// in the update queue. This allows reporting and tracing of what is causing
// the user to see a loading state.
//
// Also allows hydration callbacks to fire when a dehydrated boundary gets
// hydrated or deleted.
//
// This will eventually be replaced by the Transition Tracing proposal.

var enableSuspenseCallback = false; // Experimental Scope support.

var enableScopeAPI = false; // Experimental Create Event Handle API.

var enableCreateEventHandleAPI = false; // Support legacy Primer support on internal FB www

var enableLegacyFBSupport = false; // -----------------------------------------------------------------------------
// Ongoing experiments
//
// These are features that we're either actively exploring or are reasonably
// likely to include in an upcoming release.
// -----------------------------------------------------------------------------
// Yield to the browser event loop and not just the scheduler event loop before passive effects.
// Fix gated tests that fail with this flag enabled before turning it back on.

var enableYieldingBeforePassive = false; // Experiment to intentionally yield less to block high framerate animations.

var enableThrottledScheduling = false;
var enableLegacyCache = /* unused pure expression or super */null && 0;
var enableAsyncIterableChildren = /* unused pure expression or super */null && 0;
var enableTaint = /* unused pure expression or super */null && 0;
var enablePostpone = /* unused pure expression or super */null && 0;
var enableHalt = /* unused pure expression or super */null && 0;
var enableViewTransition = /* unused pure expression or super */null && 0;
var enableGestureTransition = /* unused pure expression or super */null && 0;
var enableScrollEndPolyfill = /* unused pure expression or super */null && 0;
var enableSuspenseyImages = false;
var enableFizzBlockingRender = /* unused pure expression or super */null && 0; // rel="expect"

var enableSrcObject = /* unused pure expression or super */null && 0;
var enableHydrationChangeEvent = /* unused pure expression or super */null && 0;
var enableDefaultTransitionIndicator = /* unused pure expression or super */null && 0;
/**
 * Switches Fiber creation to a simple object instead of a constructor.
 */

var enableObjectFiber = false;
var enableTransitionTracing = false; // FB-only usage. The new API has different semantics.

var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber

var enableSuspenseAvoidThisFallback = false;
var enableCPUSuspense = /* unused pure expression or super */null && 0; // Test this at Meta before enabling.

var enableNoCloningMemoCache = false;
var enableUseEffectEventHook = /* unused pure expression or super */null && 0; // Test in www before enabling in open source.
// Enables DOM-server to stream its instruction set as data-attributes
// (handled with an MutationObserver) instead of inline-scripts

var enableFizzExternalRuntime = /* unused pure expression or super */null && 0;
var alwaysThrottleRetries = true;
var passChildrenWhenCloningPersistedNodes = false;
/**
 * Enables a new Fiber flag used in persisted mode to reduce the number
 * of cloned host components.
 */

var enablePersistedModeClonedFlag = false;
var enableEagerAlternateStateNodeCleanup = true;
/**
 * Enables an expiration time for retry lanes to avoid starvation.
 */

var enableRetryLaneExpiration = false;
var retryLaneExpirationMs = 5000;
var syncLaneExpirationMs = 250;
var transitionLaneExpirationMs = 5000;
/**
 * Enables a new error detection for infinite render loops from updates caused
 * by setState or similar outside of the component owning the state.
 */

var enableInfiniteRenderLoopDetection = false;
var enableLazyPublicInstanceInFabric = false;
var enableFragmentRefs = /* unused pure expression or super */null && 0; // -----------------------------------------------------------------------------
// Ready for next major.
//
// Alias __NEXT_MAJOR__ to __EXPERIMENTAL__ for easier skimming.
// -----------------------------------------------------------------------------
// TODO: Anything that's set to `true` in this section should either be cleaned
// up (if it's on everywhere, including Meta and RN builds) or moved to a
// different section of this file.
// const __NEXT_MAJOR__ = __EXPERIMENTAL__;
// Renames the internal symbol for elements since they have changed signature/constructor

var renameElementSymbol = true;
/**
 * Enables a fix to run insertion effect cleanup on hidden subtrees.
 */

var enableHiddenSubtreeInsertionEffectCleanup = false;
/**
 * Removes legacy style context defined using static `contextTypes` and consumed with static `childContextTypes`.
 */

var disableLegacyContext = true;
/**
 * Removes legacy style context just from function components.
 */

var disableLegacyContextForFunctionComponents = true; // Enable the moveBefore() alternative to insertBefore(). This preserves states of moves.

var enableMoveBefore = false; // Disabled caching behavior of `react/cache` in client runtimes.

var disableClientCache = true; // Warn on any usage of ReactTestRenderer

var enableReactTestRendererWarning = true; // Disables legacy mode
// This allows us to land breaking changes to remove legacy mode APIs in experimental builds
// before removing them in stable in the next Major

var disableLegacyMode = true; // -----------------------------------------------------------------------------
// Chopping Block
//
// Planned feature deprecations and breaking changes. Sorted roughly in order of
// when we plan to enable them.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// React DOM Chopping Block
//
// Similar to main Chopping Block but only flags related to React DOM. These are
// grouped because we will likely batch all of them into a single major release.
// -----------------------------------------------------------------------------
// Disable support for comment nodes as React DOM containers. Already disabled
// in open source, but www codebase still relies on it. Need to remove.

var disableCommentsAsDOMContainers = true;
var enableTrustedTypesIntegration = false; // Prevent the value and checked attributes from syncing with their related
// DOM properties

var disableInputAttributeSyncing = false; // Disables children for <textarea> elements

var disableTextareaChildren = false; // -----------------------------------------------------------------------------
// Debugging and DevTools
// -----------------------------------------------------------------------------
// Gather advanced timing metrics for Profiler subtrees.

var enableProfilerTimer = /* unused pure expression or super */null && 0; // Adds performance.measure() marks using Chrome extensions to allow formatted
// Component rendering tracks to show up in the Performance tab.
// This flag will be used for both Server Component and Client Component tracks.
// All calls should also be gated on enableProfilerTimer.

var enableComponentPerformanceTrack = true; // Adds user timing marks for e.g. state updates, suspense, and work loop stuff,
// for an experimental timeline tool.

var enableSchedulingProfiler = !enableComponentPerformanceTrack && false; // Record durations for commit and passive effects phases.

var enableProfilerCommitHooks = /* unused pure expression or super */null && 0; // Phase param passed to onRender callback differentiates between an "update" and a "cascading-update".

var enableProfilerNestedUpdatePhase = /* unused pure expression or super */null && 0;
var enableAsyncDebugInfo = /* unused pure expression or super */null && 0; // Track which Fiber(s) schedule render work.

var enableUpdaterTracking = /* unused pure expression or super */null && 0;
var ownerStackLimit = 1e4;