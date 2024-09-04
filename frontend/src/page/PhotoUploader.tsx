

import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { UploadIcon, ImageIcon, LogOutIcon } from 'lucide-react'
import auroraLogo from '../../public/Logo-Website.webp'
import { Textarea } from '../components/ui/textarea'

const host = "locahost"

export default function PhotoUploader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [password, setPassword] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [felicitaciones, setFelicitaciones] = useState('')
  const [sugerencias, setSugerencias] = useState('')
  const [loading, setLoading] = useState(false)

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
  }, [isLoggedIn, groupName])

  const handleLogin = (event) => {
    event.preventDefault()
    setLoading(true)
    checkIfGroupExists(groupName)
      .then(response => {
        if (response.status !== 200) {
          setLoading(false)
          alert('Invalid group name or password')
          return
        } else {
          const passwordToCheck = btoa(groupName)
          if (password !== passwordToCheck) {
            setLoading(false)
            alert('Invalid group name or password')
            return
          }
          setLoading(false)
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
      setLoading(true)
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('felicitaciones', felicitaciones)
      formData.append('sugerencias', sugerencias)

      sendPhoto(groupName, formData)
        .then(response => {
          if (!response.filePath) {
            setLoading(false)
            alert('Error uploading photo')
            return
          }

          const photo = {
            id: Date.now(),
            name: selectedFile.name,
            url: response.url,
            felicitaciones: undefined,
            sugerencias: undefined,
          }

          if (felicitaciones) {
            photo.felicitaciones = felicitaciones
          }

          if (sugerencias) {
            photo.sugerencias = sugerencias
          }

          setUploadedPhotos([...uploadedPhotos, photo])

          setSelectedFile(null)
          event.target.reset()
          setLoading(false)
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
                <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
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
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Bienvenido, {groupName}!</h2>
                <Button variant="outline" onClick={handleLogout} className="text-red-500 border-red-500 hover:bg-red-50">
                  <LogOutIcon className="mr-2 h-4 w-4" /> Cerrar Sesión
                </Button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4" encType='multipart/form-data'>
                <div>
                  <Label htmlFor="photo" className="text-gray-700">Selecciona la foto</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <Label htmlFor="felicitaciones">Felicitaciones</Label>
                  <Textarea
                    id="felicitaciones"
                    value={felicitaciones}
                    onChange={(e) => setFelicitaciones(e.target.value)}
                    placeholder="Introduce tus felicitaciones aqui"
                    className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <Label htmlFor="sugerencias">Sugerencias</Label>
                  <Textarea
                    id="sugerencias"
                    value={sugerencias}
                    onChange={(e) => setSugerencias(e.target.value)}
                    placeholder="Introduce tus sugerencias aqui"
                    className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!selectedFile}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  <UploadIcon className="mr-2 h-4 w-4" /> {loading ? 'Subiendo...' : 'Subir foto'}
                </Button>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Fotos subidas</h3>
                {uploadedPhotos.length === 0 ? (
                  <p className="text-gray-500">No se han subido fotos aun</p>
                ) : (
                  <ul className="space-y-2">
                    {uploadedPhotos.map((photo) => (
                      <Card key={photo.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <ImageIcon className="h-5 w-5 text-cyan-500" />
                            <span className="font-medium">{photo.name}</span>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm font-medium">Felicitaciones</Label>
                              <p className="text-sm text-gray-600">{photo.felicitaciones || 'No hay ninguna queja'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Sugerencias</Label>
                              <p className="text-sm text-gray-600">{photo.sugerencias || 'No hay ninguna sugerencia'}</p>
                            </div>
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