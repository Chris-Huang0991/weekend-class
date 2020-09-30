import React from 'react'

const useRoutes = () => {
  const routes = React.useMemo(()=>
    [
      { path:'/', exact: true, component: React.lazy(() => import(`pages/Home`)) },
      { path:'/about', exact: true, component: React.lazy(() => import(`pages/About`)) },
      { path:'/posts', exact: true, component: React.lazy(() => import(`pages/Posts`)) },
      { path:'/post/:postId', exact: true, component: React.lazy(() => import(`pages/PostCard`)) }
    ],
  [])
  return routes
}


export default useRoutes
