import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Church } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FileUpload } from '../ui/FileUpload'; // Assuming FileUpload passes a File object
import { supabase, Parish } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const ParishManager: React.FC = () => {
  const [parish, setParish] = useState<Partial<Parish>>({
    name: '',
    history: '',
    founded_year: 1985,
    address: '',
    phone: '',
    email: '',
    logo_url: null,
    logo_url_dark: null,
    logo_url_light: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState({
    original: false,
    dark: false,
    light: false
  });

  useEffect(() => {
    fetchParishData();
  }, []);

  const fetchParishData = async () => {
    try {
      const { data, error } = await supabase
        .from('parishes')
        .select('*, logo_url_dark, logo_url_light, cloudinary_public_id_dark, cloudinary_public_id_light')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is expected for initial setup
        throw error;
      }

      if (data) {
        setParish(data);
      }
    } catch (error) {
      console.error('Error fetching parish data:', error);
      // Only show a toast if it's a real error, not just no data found
      if (error instanceof Error && error.message !== 'PGRST116') {
        toast.error('Erro ao buscar dados da paróquia.');
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // First, check if a parish record already exists
      const { data: existingData, error: fetchError } = await supabase
        .from('parishes')
        .select('id')
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw fetchError;
      }

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('parishes')
          .update({
            ...parish,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('parishes')
          .insert([parish]);

        if (insertError) throw insertError;
      }

      toast.success('Informações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving parish data:', error);
      toast.error('Erro ao salvar informações');
    } finally {
      setIsLoading(false);
    }
  };

  // This is the single, corrected image upload function
  const handleCloudinaryUpload = async (result: { publicId: string; url: string; secureUrl: string }, logoType: 'original' | 'dark' | 'light' = 'original') => {
    if (logoType === 'dark') {
      setParish(prev => ({ 
        ...prev, 
        logo_url_dark: result.secureUrl,
        cloudinary_public_id_dark: result.publicId 
      }));
    } else if (logoType === 'light') {
      setParish(prev => ({ 
        ...prev, 
        logo_url_light: result.secureUrl,
        cloudinary_public_id_light: result.publicId 
      }));
    } else {
      setParish(prev => ({ 
        ...prev, 
        logo_url: result.secureUrl,
        cloudinary_public_id: result.publicId 
      }));
    }
    toast.success('Logo carregado com sucesso!');
  };

  const handleSupabaseUpload = async (result: { url: string; path: string }, logoType: 'original' | 'dark' | 'light' = 'original') => {
    if (logoType === 'dark') {
      setParish(prev => ({ ...prev, logo_url_dark: result.url }));
    } else if (logoType === 'light') {
      setParish(prev => ({ ...prev, logo_url_light: result.url }));
    } else {
      setParish(prev => ({ ...prev, logo_url: result.url }));
    }
    toast.success('Logo carregado com sucesso!');
  };

  const handleLogoUpload = async (files: FileList | null, logoType: 'original' | 'dark' | 'light' = 'original') => {
    const file = files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [logoType]: true }));
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem muito grande (máximo 5MB)');
        return;
      }

      const fileExt = file.name.split('.').pop();
      // Ensure a consistent file name for the logo, using upsert to replace it
      const fileName = `logo-${logoType}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload the file, using upsert to overwrite if it exists
      const { error: uploadError } = await supabase.storage
        .from('parish-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('parish-photos')
        .getPublicUrl(filePath);

      if (logoType === 'dark') {
        setParish(prev => ({ ...prev, logo_url_dark: urlData.publicUrl }));
      } else if (logoType === 'light') {
        setParish(prev => ({ ...prev, logo_url_light: urlData.publicUrl }));
      } else {
        setParish(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      }
      toast.success('Logo carregado com sucesso!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erro ao carregar logo');
    } finally {
      setIsUploading(prev => ({ ...prev, [logoType]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">Informações da Paróquia</h3>
        <h3 className="text-2xl font-bold text-gray-800">Informações da Catedral</h3>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Informações Básicas da Catedral</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Catedral
              </label>
              <input
                type="text"
                value={parish.name || ''}
                onChange={(e) => setParish(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome completo da catedral"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano de Fundação
              </label>
              <input
                type="number"
                value={parish.founded_year || ''}
                onChange={(e) => setParish(prev => ({ ...prev, founded_year: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                value={parish.address || ''}
                onChange={(e) => setParish(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Endereço completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="text"
                value={parish.phone || ''}
                onChange={(e) => setParish(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={parish.email || ''}
                onChange={(e) => setParish(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contato@catedralsaomiguel.com.br"
              />
            </div>
          </div>
        </Card>

        {/* Logo Upload */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Logos da Catedral</h4>
          
          <div className="space-y-6">
            {/* Logo Original */}
            <div className="text-center">
              <h5 className="text-md font-medium text-gray-700 mb-3">Logo Principal (Uso Geral)</h5>
              {parish.logo_url ? (
                <div className="mb-4">
                  <img
                    src={parish.logo_url}
                    alt="Logo Principal da Catedral"
                    className="w-32 h-32 object-contain mx-auto rounded-lg border border-gray-200"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Church className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <FileUpload
                onCloudinaryUpload={(result) => handleCloudinaryUpload(result, 'original')}
                onSupabaseUpload={(result) => handleSupabaseUpload(result, 'original')}
                onFileSelect={(files) => handleLogoUpload(files, 'original')}
                disabled={isUploading.original}
                folder="logos"
              >
                <Button variant="secondary" disabled={isUploading.original} size="sm">
                  <Church className="h-4 w-4" />
                  {isUploading.original ? 'Carregando...' : 'Carregar Logo Principal'}
                </Button>
              </FileUpload>
              {parish.logo_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setParish(prev => ({ ...prev, logo_url: null, cloudinary_public_id: null }))}
                  className="text-red-600 mt-2"
                >
                  Remover
                </Button>
              )}
            </div>

            {/* Logo para Fundo Claro (Logo Escuro) */}
            <div className="text-center">
              <h5 className="text-md font-medium text-gray-700 mb-3">Logo para Fundo Claro (Logo Escuro)</h5>
              {parish.logo_url_dark ? (
                <div className="mb-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                    <img
                      src={parish.logo_url_dark}
                      alt="Logo Escuro da Catedral"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                  <Church className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <FileUpload
                onCloudinaryUpload={(result) => handleCloudinaryUpload(result, 'dark')}
                onSupabaseUpload={(result) => handleSupabaseUpload(result, 'dark')}
                onFileSelect={(files) => handleLogoUpload(files, 'dark')}
                disabled={isUploading.dark}
                folder="logos"
              >
                <Button variant="outline" disabled={isUploading.dark} size="sm">
                  <Church className="h-4 w-4" />
                  {isUploading.dark ? 'Carregando...' : 'Carregar Logo Escuro'}
                </Button>
              </FileUpload>
              {parish.logo_url_dark && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setParish(prev => ({ ...prev, logo_url_dark: null, cloudinary_public_id_dark: null }))}
                  className="text-red-600 mt-2"
                >
                  Remover
                </Button>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Recomendado: Logo escuro/colorido para usar em fundos claros
              </p>
            </div>

            {/* Logo para Fundo Escuro (Logo Claro) */}
            <div className="text-center">
              <h5 className="text-md font-medium text-gray-700 mb-3">Logo para Fundo Escuro (Logo Claro)</h5>
              {parish.logo_url_light ? (
                <div className="mb-4">
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-200 inline-block">
                    <img
                      src={parish.logo_url_light}
                      alt="Logo Claro da Catedral"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-800">
                  <Church className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <FileUpload
                onCloudinaryUpload={(result) => handleCloudinaryUpload(result, 'light')}
                onSupabaseUpload={(result) => handleSupabaseUpload(result, 'light')}
                onFileSelect={(files) => handleLogoUpload(files, 'light')}
                disabled={isUploading.light}
                folder="logos"
              >
                <Button variant="outline" disabled={isUploading.light} size="sm">
                  <Church className="h-4 w-4" />
                  {isUploading.light ? 'Carregando...' : 'Carregar Logo Claro'}
                </Button>
              </FileUpload>
              {parish.logo_url_light && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setParish(prev => ({ ...prev, logo_url_light: null, cloudinary_public_id_light: null }))}
                  className="text-red-600 mt-2"
                >
                  Remover
                </Button>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Recomendado: Logo branco/claro para usar no cabeçalho (fundo escuro)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h6 className="font-semibold text-blue-800 mb-2">💡 Dicas para Logos:</h6>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Logo Principal:</strong> Versão colorida padrão</li>
                <li>• <strong>Logo Escuro:</strong> Para fundos claros (rodapé, seções brancas)</li>
                <li>• <strong>Logo Claro:</strong> Para fundos escuros (cabeçalho azul)</li>
                <li>• <strong>Formato:</strong> PNG com fundo transparente funciona melhor</li>
                <li>• <strong>Tamanho:</strong> Mínimo 200x200px para qualidade</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Preview dos Logos */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Preview dos Logos</h4>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Preview Fundo Claro */}
            <div className="text-center">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Em Fundo Claro</h5>
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-32 flex items-center justify-center">
                {parish.logo_url_dark ? (
                  <img
                    src={parish.logo_url_dark}
                    alt="Preview Logo Escuro"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : parish.logo_url ? (
                  <img
                    src={parish.logo_url}
                    alt="Preview Logo Principal"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Church className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>

            {/* Preview Fundo Escuro */}
            <div className="text-center">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Em Fundo Escuro (Cabeçalho)</h5>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 h-32 flex items-center justify-center">
                {parish.logo_url_light ? (
                  <img
                    src={parish.logo_url_light}
                    alt="Preview Logo Claro"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : parish.logo_url ? (
                  <img
                    src={parish.logo_url}
                    alt="Preview Logo Principal"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Church className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>

            {/* Preview Rodapé */}
            <div className="text-center">
              <h5 className="text-sm font-medium text-gray-700 mb-3">No Rodapé</h5>
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 h-32 flex items-center justify-center">
                {parish.logo_url_dark ? (
                  <img
                    src={parish.logo_url_dark}
                    alt="Preview Logo Rodapé"
                    className="max-w-full max-h-full object-contain opacity-80"
                  />
                ) : parish.logo_url ? (
                  <img
                    src={parish.logo_url}
                    alt="Preview Logo Principal"
                    className="max-w-full max-h-full object-contain opacity-80"
                  />
                ) : (
                  <img
                    src="/footer.webp"
                    alt="Footer padrão"
                    className="max-w-full max-h-full object-contain opacity-80"
                  />
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* History */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">História da Catedral</h4>
        <textarea
          value={parish.history || ''}
          onChange={(e) => setParish(prev => ({ ...prev, history: e.target.value }))}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Conte a história da catedral, seus marcos importantes, crescimento da comunidade..."
        />
        <p className="text-xs text-gray-500 mt-2">
          Use parágrafos separados por linha em branco para melhor formatação
        </p>
      </Card>
    </div>
  );
};