import Home from "./components/Home"
import CustomNavBar from "./components/CustomNavBar";
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import Documentation from "./components/Documentation";
import Contact from "./components/Contact";


const router = createBrowserRouter([
   {
    path: '/',
    element: <Layout />,  // common layout with navbar + outlet
    children: [
      { index: true, element: <Home /> },  // path: "/"
      { path: 'flowplanner/', element: <Home /> },
      { path: 'flowplanner/:name', element: <Home /> }, // dynamic route
      { path: 'documentation', element: <Documentation /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
], {
  basename: '/Clouded-Peak',
});

function Layout() {
  return (
    <div className="flex flex-col w-screen h-screen bg-neutral-900">
      <CustomNavBar />
      <main className="flex-grow overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
// import { useState } from 'react'
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
