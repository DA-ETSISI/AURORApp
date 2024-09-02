
import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { TrashIcon, ImageIcon, PlusIcon } from 'lucide-react'
import auroraLogo from '../../public/Logo-Website.webp'

export default function AdminPage() {
  const [groups, setGroups] = useState([])
  const [adminPassword, setAdminPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id.toString())
  const [newGroupName, setNewGroupName] = useState('')
  
  useEffect(() => {
    getGroups().then(groups => {
      if (groups.message) {
        setGroups([])
        return
      }
      for (const group of groups) {
        group.id = group.name
        const photos = getPhotos(group.id)
        photos.then(data => {
          group.photos = data
        })
      }

      setGroups(groups)
    })
  }, [])



  const getGroups = () => {
    return fetch(`http://${import.meta.env.VITE_HOST}:8080/groups`, { headers: {'Access-Control-Allow-Origin': '*'} }).then(response => response.json())
  }

  const getPhotos = (groupId) => {
    return fetch(`http://${import.meta.env.VITE_HOST}:8080/files/${groupId}`, { headers: {'Access-Control-Allow-Origin': '*'}}).then(response => response.json())
  }


  const deletePhoto = (groupId, photoId) => {
    return fetch(`http://${import.meta.env.VITE_HOST}:8080/file/${groupId}/${photoId}`, {
      method: 'DELETE',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }).then(response => response.json())
  }


  
  const handleLogin = (event) => {
    event.preventDefault()
    // In a real app, you would validate against a backend
    if (adminPassword === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsLoggedIn(true)
    } else {
      alert('Invalid password')
    }
  }

  const handleDeletePhoto = (groupId, photoId) => {
    deletePhoto(groupId, photoId).then(response => {
      if (response.error) {
        alert('Error deleting photo')
        return
      }
      setGroups(groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            photos: group.photos.filter(photo => photo.id !== photoId)
          }
        }
        return group
      }))
    })
  }

  const handleCreateGroup = (event) => {
    event.preventDefault()
    if (newGroupName.trim()) {
      fetch(`http://${import.meta.env.VITE_HOST}:8080/group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ name: newGroupName.trim()})
      }).then(() => {
        const newGroup = {
          id: newGroupName.trim(),
          name: newGroupName.trim(),
          photos: []
        }
        setGroups([...groups, newGroup])
        setNewGroupName('')
        setSelectedGroupId(newGroup.id.toString())
      })
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
          <CardHeader className="flex flex-col items-center space-y-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
            <img
              src={auroraLogo}
              alt="Aurora Logo"
              className="w-48 h-12 object-contain mb-2"
            />
            <CardTitle className="text-3xl font-bold">Inicio de Sesión Observador</CardTitle>
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
          <CardTitle className="text-3xl font-bold">Vista del Observador</CardTitle>
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
                  Crear
                </Button>
              </form>
            </div>
          </div>
          
          {selectedGroup && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Fotos del grupo {selectedGroup.name}</h3>
              {selectedGroup.photos.length === 0 ? (
                <p className="text-gray-500">Este grupo aún no ha subido fotos</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedGroup.photos.map(photo => (
                    <Card key={photo.id.toString()} className="overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-auto object-cover"
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