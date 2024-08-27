

import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { UploadIcon, ImageIcon, LogOutIcon } from 'lucide-react'

export default function PhotoUploader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [password, setPassword] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadedPhotos, setUploadedPhotos] = useState([])

  const handleLogin = (event) => {
    event.preventDefault()
    if (groupName && password) {
      setIsLoggedIn(true)
    }
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
      formData.append('photo', selectedFile)
      formData.append('group', groupName)

      setUploadedPhotos([...uploadedPhotos, { 
        id: Date.now(), 
        name: selectedFile.name
      }])

      setSelectedFile(null)
      event.target.reset()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
          <img
            src="../../public/aurora.png"
            alt="Aurora Logo"
            width={200}
            height={50}
            className="mb-2"
          />
          <CardTitle className="text-3xl font-bold">Photo Uploader</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="groupName" className="text-gray-700">Group Name</Label>
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
              <form onSubmit={handleUpload} className="space-y-4">
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
                      <li key={photo.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                        <ImageIcon className="h-5 w-5 text-cyan-500" />
                        <span className="text-gray-700">{photo.name}</span>
                      </li>
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