---
id: 2
titleCN: 关于 React Hooks 心智模型演进的个人技术叙事
titleEN: The Evolution of My Mental Model: A Narrative on React Hooks
date: 2025.12.18
category: tech
---

我最初接触 Hooks 时，将其视为对生命周期方法的函数式语法糖。这种浅层认知持续了相当一段时间，直至在复杂业务场景中遭遇逻辑复用的瓶颈。本文将系统阐述我个人对 React 技术范式，特别是 Hooks 设计哲学的理解演进过程。

## 第一阶段：生命周期映射期（认知表层）

早期使用类组件时，我的思维完全被生命周期方法所主导。组件逻辑被强制分散于 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 等钩子中，导致相关关注点被物理分离。例如，一个数据订阅功能需要在 `componentDidMount` 中建立连接，在 `componentDidUpdate` 中处理参数变化，在 `componentWillUnmount` 中清理资源。这种时间轴驱动的编程模型，迫使开发者必须在脑内构建组件的时间线，并手动保证状态同步的一致性。

## 第二阶段：副作用同步期（范式转换）

Hooks 的引入，特别是 `useEffect`，代表了一种根本性的范式转移。我逐渐理解到，Hooks 的核心价值不在于 “何时执行代码”，而在于如何建立状态与副作用之间的同步关系。每个 `useEffect` 都是对系统的一种声明：“当这些特定依赖项发生变化时，请执行此同步逻辑以匹配外部系统。”

这种认知转变带来了代码组织的革新。我不再思考 “挂载时做什么”，而是思考 “这个副作用需要与哪些状态保持同步”。例如，一个聊天组件的连接逻辑，从生命周期方法中解耦出来，成为一个自包含的同步单元：

```javascript
// 传统生命周期方法（关注时间点）
class ChatComponent extends React.Component {
  componentDidMount() {
    this.setupConnection(this.props.roomId);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.roomId !== this.props.roomId) {
      this.cleanupConnection();
      this.setupConnection(this.props.roomId);
    }
  }
  
  componentWillUnmount() {
    this.cleanupConnection();
  }
}

// Hooks 范式（关注同步关系）
function ChatComponent({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    
    // 清理函数定义了如何中断同步
    return () => connection.disconnect();
  }, [roomId]); // 依赖数组定义了同步触发的条件
}
```

## 第三阶段：渲染逻辑与副作用分离期（架构意识）

随着对 Hooks 理解的深入，我逐渐认识到 React 团队在设计上的深层意图：将渲染逻辑与副作用彻底分离。渲染应当是一个纯函数，仅负责将状态映射为虚拟 DOM。所有与外部系统的交互（数据获取、订阅、DOM 操作）都应通过 `useEffect` 进行编排。

这一认知促使我重新评估代码结构。我学会了区分：

- 事件处理函数：处理用户交互，可以包含副作用，但应当是明确的、由用户触发的
- 渲染逻辑：必须是纯的、可预测的状态到 UI 的映射
- 同步副作用：通过 `useEffect` 声明，自动响应状态变化

## 第四阶段：自定义 Hook 作为抽象工具期（工程实践）

自定义 Hooks 的出现，代表了我对 React 理解的一个飞跃。这不仅仅是代码复用的工具，更是逻辑关注点分离的实现手段。我意识到，一个设计良好的自定义 Hook 应当：

1. 封装单一、完整的逻辑单元
2. 提供清晰的输入输出接口
3. 内部管理其自身状态和生命周期

例如，实现一个数据获取的 Hook：

```javascript
// 初级实现：逻辑与组件耦合
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let cancelled = false;
    
    setLoading(true);
    fetchUser(userId).then(data => {
      if (!cancelled) {
        setUser(data);
        setLoading(false);
      }
    });
    
    return () => { cancelled = true; };
  }, [userId]);
  
  // 渲染逻辑...
}

// 高级抽象：自定义 Hook 封装完整逻辑单元
function useUser(userId) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    let cancelled = false;
    
    setState(s => ({ ...s, loading: true }));
    
    fetchUser(userId)
      .then(data => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({ data: null, loading: false, error });
        }
      });
    
    return () => { cancelled = true; };
  }, [userId]);
  
  return state;
}

// 组件变得极其简洁
function UserProfile({ userId }) {
  const { data: user, loading, error } = useUser(userId);
  // 纯粹的渲染逻辑
}
```

## 第五阶段：并发模式下的思维演进（前沿认知）

React 18 引入的并发特性，迫使我进一步升级心智模型。在并发渲染中，组件可能被多次渲染但只提交一次结果，也可能在高优先级更新中断低优先级渲染。这意味着：

- 副作用必须具有幂等性，能够安全地多次执行
- 状态更新可能需要区分优先级（`startTransition`， `useDeferredValue`）
- 渲染不再是线性的、确定性的时间线

我逐渐学习到，在并发世界中，组件应该像纯函数一样，能够随时被中断和重新开始。这要求副作用逻辑具有更高的健壮性，状态更新更加细粒度。

## 技术见解与反思

1. 闭包是核心机制，而非实现细节：Hooks 的强大能力建立在 JavaScript 闭包基础上。每个渲染 “帧” 都有其独立的闭包作用域，这既是 Hooks 灵活性的来源，也是依赖项数组必要性的根本原因。
2. 状态不变性是性能优化的基石：React 的渲染优化（`React.memo`， `useMemo`， `useCallback`）都依赖于对状态变更的快速检测。深层不可变数据结构和精细的状态分割，是构建高性能 React 应用的前提。
3. 副作用是必要的复杂性：虽然 React 鼓励纯函数式组件，但 UI 开发本质上是与充满副作用的现实世界交互。Hooks 的价值在于为这种复杂性提供了声明式的管理工具，而非消除复杂性本身。
4. 类型系统是规模化开发的必需品：TypeScript 与 React 的结合，使得 Hooks 的契约（输入输出类型）能够被静态验证。这在大型应用中显著降低了认知负荷和维护成本。

## 结语

React 的技术演进，特别是 Hooks 的引入，不仅仅是一套新的 API，更是一种对 UI 开发本质的重新思考。它推动开发者从 “时间驱动” 的思维模式转向 “状态驱动” 和 “同步驱动” 的模式。这种转变是渐进的，需要在实际项目中反复实践和反思才能内化。

对我而言，掌握 React 不是学习一套语法，而是接受一种新的 UI 构建哲学：UI 是状态的函数，而副作用是状态与外部世界的同步桥梁。这一认知转变，远比任何具体 API 的使用技巧更为重要和持久。

---
[EN_START]

When I first encountered Hooks, I viewed them merely as functional "syntax sugar" for lifecycle methods. This superficial understanding persisted for a long time—until I hit a bottleneck in logic reuse within complex business scenarios. This article systematically outlines the evolution of my understanding of the React paradigm, specifically the design philosophy behind Hooks.

## Phase 1: The Lifecycle Mapping Period (Surface Level)

In the early days of Class Components, my thinking was entirely dominated by lifecycle methods. Component logic was forcibly fragmented across `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. This led to a physical separation of related concerns.

For instance, a data subscription required establishing a connection in `componentDidMount`, handling parameter changes in `componentDidUpdate`, and cleaning up resources in `componentWillUnmount`. This **timeline-driven programming model** forced developers to mentally reconstruct the component's timeline and manually ensure the consistency of state synchronization.

## Phase 2: The Side Effect Synchronization Period (Paradigm Shift)

The introduction of Hooks, particularly `useEffect`, represented a fundamental paradigm shift. I gradually realized that the core value of Hooks isn't "when to execute code," but rather **how to establish a synchronization relationship between state and side effects.** Every `useEffect` is a declaration to the system: *"Whenever these specific dependencies change, please execute this synchronization logic to match the external system."* This shift revolutionized my code organization. I stopped thinking about "what to do on mount" and started thinking about "which state this side effect needs to stay in sync with." For example, the connection logic for a chat component moved from being scattered across lifecycles to becoming a self-contained unit of synchronization:

JavaScript

```
// Traditional Lifecycle Approach (Focus on timing)
class ChatComponent extends React.Component {
  componentDidMount() {
    this.setupConnection(this.props.roomId);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.roomId !== this.props.roomId) {
      this.cleanupConnection();
      this.setupConnection(this.props.roomId);
    }
  }
  
  componentWillUnmount() {
    this.cleanupConnection();
  }
}

// Hooks Paradigm (Focus on synchronization)
function ChatComponent({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    
    // The cleanup function defines how to "undo" the synchronization
    return () => connection.disconnect();
  }, [roomId]); // The dependency array defines the conditions for synchronization
}
```

## Phase 3: Separation of Rendering Logic and Side Effects (Architectural Awareness)

As my understanding deepened, I recognized the React team's deeper intent: **the complete decoupling of rendering logic from side effects.** Rendering should be a pure function, responsible only for mapping state to the Virtual DOM. All interactions with external systems (data fetching, subscriptions, DOM manipulations) should be orchestrated through `useEffect`. This led me to distinguish between:

- **Event Handlers:** Handle user interactions; can contain side effects but must be explicit and triggered by the user.
- **Rendering Logic:** Must be a pure, predictable mapping from State to UI.
- **Synchronous Side Effects:** Declared via `useEffect` to automatically respond to state changes.

## Phase 4: Custom Hooks as Abstraction Tools (Engineering Practice)

The emergence of Custom Hooks represented a leap in my understanding. They are not just tools for code reuse; they are the primary means of **Separation of Concerns**. I realized that a well-designed Custom Hook should:

1. Encapsulate a single, complete logical unit.
2. Provide a clear input/output interface.
3. Manage its own internal state and lifecycle.

Example: Abstracting data fetching.

JavaScript

```
// Advanced Abstraction: Custom Hook encapsulating the logic unit
function useUser(userId) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true }));
    
    fetchUser(userId)
      .then(data => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({ data: null, loading: false, error });
        }
      });
    
    return () => { cancelled = true; };
  }, [userId]);
  
  return state;
}

// The component becomes extremely concise
function UserProfile({ userId }) {
  const { data: user, loading, error } = useUser(userId);
  // Pure rendering logic...
}
```

## Phase 5: Thinking in Concurrent Mode (Advanced Cognition)

React 18’s Concurrent features forced another upgrade to my mental model. In concurrent rendering, a component might render multiple times before committing once, or a high-priority update might interrupt a low-priority render. This implies:

- **Side effects must be idempotent:** They must be safe to execute multiple times.
- **State updates need priority differentiation:** Using tools like `startTransition` or `useDeferredValue`.
- **Rendering is no longer a linear, deterministic timeline.**

In a concurrent world, components should behave like pure functions that can be paused and restarted at any time. This requires more robust side-effect logic and more granular state management.

## Technical Insights & Reflections

1. **Closures are the Core Mechanism, Not a Detail:** The power of Hooks is built on JavaScript closures. Every render "frame" has its own independent closure scope. This is the source of Hooks' flexibility and the fundamental reason why dependency arrays are necessary.
2. **Immutability is the Bedrock of Optimization:** React’s rendering optimizations (`React.memo`, `useMemo`, `useCallback`) rely on fast detection of state changes. Deeply immutable data structures and fine-grained state splitting are prerequisites for high-performance apps.
3. **Side Effects are Necessary Complexity:** While React encourages pure functional components, UI development is inherently an interaction with a side-effect-heavy world. Hooks provide declarative management for this complexity rather than trying to eliminate it.
4. **Type Systems are Mandatory for Scale:** The combination of TypeScript and React ensures that the "contracts" of Hooks (input/output types) are statically verified, significantly reducing cognitive load in large-scale applications.

## Conclusion

The evolution of React, especially the introduction of Hooks, is more than just a new set of APIs—it is a **rethinking of the nature of UI development.** It pushes developers to move from "Time-Driven" thinking to "State-Driven" and "Synchronization-Driven" models.

For me, mastering React was not about learning syntax, but about embracing a new philosophy: **UI is a function of state, and side effects are the synchronization bridges between that state and the external world.** This cognitive shift is far more important and enduring than any specific API trick.

Would you like me to elaborate on the **Concurrent Mode** section or perhaps help you refine the **TypeScript interfaces** for the custom hooks mentioned?
