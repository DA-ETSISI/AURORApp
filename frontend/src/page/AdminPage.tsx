import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { DownloadIcon, TrashIcon, ImageIcon, PlusIcon } from 'lucide-react'

// Simulated data for groups and photos
const initialGroups = [
  {
    id: 1,
    name: 'Group A',
    photos: [
      { id: 1, name: 'Photo 1.jpg', url: '/placeholder.svg?height=100&width=100' },
      { id: 2, name: 'Photo 2.jpg', url: '/placeholder.svg?height=100&width=100' },
    ]
  },
  {
    id: 2,
    name: 'Group B',
    photos: [
      { id: 3, name: 'Photo 3.jpg', url: '/placeholder.svg?height=100&width=100' },
    ]
  },
]

export default function Component() {
  const [groups, setGroups] = useState(initialGroups)
  const [adminPassword, setAdminPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id.toString())
  const [newGroupName, setNewGroupName] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    // In a real app, you would validate against a backend
    if (adminPassword === 'admin123') {
      setIsLoggedIn(true)
    } else {
      alert('Invalid password')
    }
  }

  const handleDeletePhoto = (groupId, photoId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          photos: group.photos.filter(photo => photo.id !== photoId)
        }
      }
      return group
    }))
  }

  const handleDownloadPhoto = (photoName) => {
    // In a real app, this would trigger a file download
    alert(`Downloading ${photoName}`)
  }

  const handleCreateGroup = (event) => {
    event.preventDefault()
    if (newGroupName.trim()) {
      const newGroup = {
        id: groups.length + 1,
        name: newGroupName.trim(),
        photos: []
      }
      setGroups([...groups, newGroup])
      setNewGroupName('')
      setSelectedGroupId(newGroup.id.toString())
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
          <CardHeader className="flex flex-col items-center space-y-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
            <img
              src="../../public/Logo-Website.webp"
              alt="Aurora Logo"
              className="w-48 h-12 object-contain mb-2"
            />
            <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="adminPassword" className="text-gray-700">Admin Password</Label>
                <Input 
                  id="adminPassword" 
                  type="password"
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                  required
                  className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedGroup = groups.find(group => group.id.toString() === selectedGroupId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
          <img
            src="../../public/Logo-Website.webp"
            alt="Aurora Logo"
            className="w-48 h-12 object-contain mb-2"
          />
          <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="mb-6 space-y-4">
            <div>
              <Label htmlFor="groupSelect" className="text-gray-700 mb-2 block">Select Group</Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger id="groupSelect" className="w-full">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newGroupName" className="text-gray-700 mb-2 block">Create New Group</Label>
              <form onSubmit={handleCreateGroup} className="flex space-x-2">
                <Input
                  id="newGroupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="flex-grow border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
                <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </form>
            </div>
          </div>
          
          {selectedGroup && (
            <div>
              <h3 className="text-xl font-semibold mb-4">{selectedGroup.name} Photos</h3>
              {selectedGroup.photos.length === 0 ? (
                <p className="text-gray-500">No photos uploaded for this group.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedGroup.photos.map(photo => (
                    <Card key={photo.id} className="overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-32 object-cover"
                      />
                      <CardContent className="p-2">
                        <div className="flex items-center mb-2">
                          <ImageIcon className="h-5 w-5 text-cyan-500 mr-2" />
                          <p className="text-sm font-medium truncate">{photo.name}</p>
                        </div>
                        <div className="flex justify-between">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadPhoto(photo.name)}
                            className="flex-1 mr-1"
                          >
                            <DownloadIcon className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeletePhoto(selectedGroup.id, photo.id)}
                            className="flex-1 ml-1 text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}