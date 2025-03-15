import { Route, RootRoute } from '@tanstack/react-router';
import App, { Chat } from '../App.tsx';

const rootRoute = new RootRoute({
  component: App,
});

const chatRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/gosipo/chat',
  component: Chat,
});

export const routeTree = rootRoute.addChildren([chatRoute]);