

import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { UploadIcon, ImageIcon, LogOutIcon } from 'lucide-react'
import auroraLogo from '../../public/Logo-Website.webp'

const host = import.meta.env.VITE_HOST || process.env.VITE_HOST

export default function PhotoUploader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [password, setPassword] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadedPhotos, setUploadedPhotos] = useState([])

  const sendPhoto = async (groupId, photo) => {
    return fetch(`http://${host}:8080/upload/${groupId}`, {
      method: 'POST',
      body: photo
    }).then(response => response.json())
  }

  const getGroupPhotos = async (groupId) => {
    return fetch(`http://${host}:8080/files/${groupId}`).then(response => response.json())
  }

  const checkIfGroupExists = async (groupId) => {
    return fetch(`http://${host}:8080/group/${groupId}`)
  }

  useEffect(() => {
    getGroupPhotos(groupName).then(photos => {
      setUploadedPhotos(photos)
    })
  },[isLoggedIn, groupName])

  const handleLogin = (event) => {
    event.preventDefault()

    checkIfGroupExists(groupName)
      .then(response => {
        if (response.status !== 200) {
          alert('Invalid group name or password')
          return
        } else {
          const passwordToCheck = btoa(groupName)
          if (password !== passwordToCheck) {
            alert('Invalid group name or password')
            return
          }

          setIsLoggedIn(true)
        }
      })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setGroupName('')
    setPassword('')
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = (event) => {
    event.preventDefault()
    if (selectedFile) {
      const formData = new FormData()
      formData.append('image', selectedFile)

      sendPhoto(groupName, formData)
        .then(response => {
          if (!response.filePath) {
            alert('Error uploading photo')
            return
          }

          setUploadedPhotos([...uploadedPhotos, { 
            id: Date.now(), 
            name: selectedFile.name,
            url: response.url
          }])

          setSelectedFile(null)
          event.target.reset()
        })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
          <img
            src={auroraLogo}
            alt="Aurora Logo"
            width={200}
            height={50}
            className="mb-2"
          />
          <CardTitle className="text-3xl font-bold">Subida de fotos</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="groupName" className="text-gray-700">Nombre de grupo</Label>
                <Input 
                  id="groupName" 
                  value={groupName} 
                  onChange={(e) => setGroupName(e.target.value)} 
                  required
                  className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                Login
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Welcome, {groupName}!</h2>
                <Button variant="outline" onClick={handleLogout} className="text-red-500 border-red-500 hover:bg-red-50">
                  <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4" encType='multipart/form-data'>
                <div>
                  <Label htmlFor="photo" className="text-gray-700">Upload Photo</Label>
                  <Input 
                    id="photo" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    required
                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!selectedFile}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  <UploadIcon className="mr-2 h-4 w-4" /> Upload Photo
                </Button>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Uploaded Photos</h3>
                {uploadedPhotos.length === 0 ? (
                  <p className="text-gray-500">No photos uploaded yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {uploadedPhotos.map((photo) => (
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
                        </div>
                      </CardContent>
                    </Card>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}