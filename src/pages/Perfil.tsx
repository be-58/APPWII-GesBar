// src/pages/Perfil.tsx
import { useState } from 'react';
import { useAuthStore } from '../hooks/useAuth';
import useApiClient from '../hooks/useApiClient';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';


const Perfil = () => {
  const { user, login } = useAuthStore();
  const apiClient = useApiClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    cedula: user?.cedula || '',
    password: '',
    password_confirmation: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const initials = user?.nombre?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) || '?';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSuccess(false);
    try {
      // Solo enviar password y confirmation si se llenó la clave
      const payload: any = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        cedula: formData.cedula,
      };
      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }
      const { data } = await apiClient.put(`/usuario`, payload);
      login(useAuthStore.getState().token!, data.user);
      setIsEditing(false);
      setSuccess(true);
      setFormData(f => ({ ...f, password: '', password_confirmation: '' }));
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setSaveError('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
            <span>{initials}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.nombre}</h1>
            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-semibold ${user?.bloqueado ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{user?.bloqueado ? 'Bloqueado' : 'Activo'}</span>
          </div>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'outline' : 'default'} className="w-full sm:w-auto">
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </Button>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-8">
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-xs font-semibold text-gray-500">Email</Label>
              <div className="mt-1 text-base text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
                {user?.email}
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500">Teléfono</Label>
              <div className="mt-1 text-base text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {user?.telefono}
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500">Cédula</Label>
              <div className="mt-1 text-base text-gray-900">{user?.cedula || <span className="text-gray-400">No registrada</span>}</div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500">Rol</Label>
              <div className="mt-1 text-base text-gray-900 capitalize flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {user?.role?.nombre}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                name="cedula"
                type="text"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Opcional"
                className="mt-1"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="password">Nueva Clave</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar en blanco para no cambiar"
                className="mt-1"
                autoComplete="new-password"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="password_confirmation">Repetir Clave</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Repite la clave"
                className="mt-1"
                autoComplete="new-password"
              />
            </div>
            <div className="col-span-2 flex space-x-3 mt-4">
              <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)} disabled={saving}>Cancelar</Button>
            </div>
            {saveError && <div className="col-span-2 text-red-600 mt-2">{saveError}</div>}
            {success && <div className="col-span-2 text-green-600 mt-2">¡Perfil actualizado!</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Perfil;
