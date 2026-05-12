# PixiVista

One way to develop an extensible component for visualizing different signals that share the same x-axis in the browser, is the following:

Rendering something to a canvas can be done using PixiJs, adding a user interface to interact with it can be done using Vue. Three separate concerns or layers are needed to implement it in a scalable way:

- Rendering (from the canvas side).
- User interaction (from the DOM side).
- Bridge between rendering and user interaction. 

This library aims to provide abstractions that can help to implement each of the layers, keeping them separated so that each one can be used independently. This solves the problem of separating the details of a specific component (its domain logic, the function the component is trying to solve) from the details that came from the infrastructure needed to wire everything together.

As a result this library can be used either to develop new components with the help of the abstractions it contains or directly adapt the ready to use components.

## Concerns.

### Rendering Abstractions.

For the rendering part a tree abstraction is being used, a node represents a layer that contains data to be rendered and children with the same structure.

Every node contains a flag that indicates whether it needs to be re-rendered and exposes methods (its API) that allows modifying its data, thus the flow is:

1. Some action causes some node to change its data, this node changes its data and maybe mark itself as outdated.

2. Every $X$ units of time, a task does a DFS on the tree to find outdated nodes and re-renders those. 

These layers have its own domain, and do not know about the other parts of the system. 

The tree of nodes is passed to a render manager which contains the Pixi details and is in charge or rendering the layers.

The root of the tree is wrapped in an object which acts as a Facade to expose an API, this hides the tree of nodes to other parts of the system, and make this the public API of the tree.

### Web User Interaction.

The user interaction is done using Vue. It renders the web components, collects the user interactions and sends them to the domain / core of the component which is where logic should reside. 

### Bridge Between Rendering and User Interaction.

For every component there is a container that holds the objects needed to wire everything together, this container includes:

- An event mediator which sends events and commands back and forth between Vue and the domain part of the component. This decouples the domain logic from Vue.
 
- A Facade object which represents the API that can be used to modify what's being rendered. This decouples the domain logic from accessing the nodes in the render tree, and thus the render logic. 

- An object that contains the domain logic of the component.

In essence the domain logic acts as the brain, holds the state data, does the computation / logic and decides what to tell to its rendering subordinates Vue and Pixi. When the computation / logic is heavy workers should be introduced. 

The domain logic employs observers to react to data changes, here is the reason:

   1. Something changes its state (could be a user interaction, or something in the canvas). 
   2. The event mediator sends this to the domain state logic. 
   3. If the domain state logic reacts by starting a computation this freezes the UI if this computation is not fast enough.

To guarantee that the UI stays responsive an observer is introduced. Its function is to keep track of a state object and check it every $X$ units of time, if changed fire an action.

Now the flow is the following:

   1. Something changes its state (could be a user interaction, or something in the canvas). 
   2. The event mediator sends this to the domain state logic. 
   3. Domain state logic change its state and returns control.
   4. An observer periodically checks whether state changed and if so starts the heavy computation or logic. This computation if executed in the main thread will freeze the application, but if done in a worker thread, will allow the user to keep interacting with the application.
   5. When the new state is ready, this may cause to update something in the User interface or in the Canvas. 

Each side, Vue UI, Render Layers and Domain Logic, speaks its own domain language, so the domain logic has to translate its data to the data that each part understands and vice versa. This ensures each part is reusable and is not tied to the other parts.

## Ready to Use Vue Components

### Plot Component

Main ready to use component of the library:

- Its goal is to visualize different signals that share the same x-axis and manage event annotations on those signals
- It does not contain domain language. So clients can adapt it to use time series or events from crypto, from EEG, etc.
  
### Metrics Component

A component that can be wired to other component that shows basic metrics like Render Time and Frames per Second in a Monitor Plot to help testing whether a component is fast enough and does not freeze.

## Project Setup

```sh
pnpm install
pnpm run dev
```

## Ways to Use It in Other Projects.

To develop the integration of this library in other projects, one way is using direct link.

```sh
pnpm add path/to/this/folder
```

This approach allows using the public API of this library (_index.ts_) in the client code, changes to this library code are automatically reflected, and source code inspections work, since the code isn't modified / bundled / minified.
