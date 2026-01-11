import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layout/app-layout';
import './App.css'
import './index.css'
import LandingPage from './pages/landing';
import OnboardingPage from './pages/onboarding';
import JobListtingPage from './pages/job-listing';
import JobPage from './pages/job';
import PostJobPage from './pages/post-job';
import SavedJobPage from './pages/saved-jobs';
import MyJobPage from './pages/my-jobs';
import { ThemeProvider } from './components/theme-provider';
import ProtectedRoute from './components/protected-route';
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children:[
      {
      path: '/',
      element: 
     
      <LandingPage />
   
      },
      {
       path : '/onboarding',
       element: 
       <ProtectedRoute>
       <OnboardingPage />
       </ProtectedRoute>
      },
      {
       path : '/jobs',
       element: 
       <ProtectedRoute>
       <JobListtingPage />
       </ProtectedRoute>
      },
      {
       path : '/job/:id',
       element: 
       <ProtectedRoute>
       <JobPage />
       </ProtectedRoute>
      },
      {
       path : '/post-job',
       element: 
       <ProtectedRoute>
       <PostJobPage />
       </ProtectedRoute>
      },
      {
       path : '/saved-jobs',
       element: 
       <ProtectedRoute>
       <SavedJobPage/>
       </ProtectedRoute>
      },
      {
       path : '/my-jobs',
       element: 
       <ProtectedRoute>
       <MyJobPage />
       </ProtectedRoute>
      }
    ]
  }
]

)

function App() {


  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme' >
    <RouterProvider router={router} />
    </ThemeProvider>
     
  );
}

export default App
