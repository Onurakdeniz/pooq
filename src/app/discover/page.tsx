import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, Hash, Brain, User } from 'lucide-react'

const DiscoverPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Discover</h1>
      
      <div className="mb-8">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <p className="text-sm text-gray-500 mt-2">Powered by semantic and LLM-based search sooon...</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className='bg-accent'>
          <CardHeader>
          <CardTitle className="flex items-center  p-1 ">
              <User className="mr-2" size={16} />
              Find People
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className='h-16'>Discover people with similar interests and connect with them.</CardDescription>
   
          </CardContent>
          <CardFooter>
          <Button className="mt-4">Find People</Button>
          </CardFooter>
        </Card>

        <Card className='bg-accent'>
          <CardHeader>
            <CardTitle className="flex items-center  p-1 ">
              <Hash className="mr-2" size={16} />
              Follow Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
          <CardDescription className='h-16'>Explore and follow topics that interest you.</CardDescription>

          </CardContent>
          <CardFooter>
          <Button className="mt-4">Try Smart Search</Button>
          </CardFooter>
        </Card>

        <Card className='bg-accent'>
          <CardHeader>
          <CardTitle className="flex items-center  p-1 ">
              <Search className="mr-2" size={14} />
         Smart Search
            </CardTitle>
          </CardHeader>
          <CardContent>
          <CardDescription className=' h-16'>Use our advanced AI-powered search to find exactly what you&apos;re looking for.</CardDescription>

          </CardContent>
          <CardFooter>
          <Button className="mt-4">Try Smart Search</Button>
          </CardFooter>
        </Card>


     
      </div>

      <div className="mt-12 text-center">
        <p className="text-xl font-semibold mb-4">Discover your world!</p>
        <p className="text-gray-600">Find people, topics, and content that match your interests.</p>
      </div>
    </div>
  )
}

export default DiscoverPage