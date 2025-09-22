// src/components/sections/ContactSection.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, User, MessageSquare, Calendar, Heart, ExternalLink, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { supabase, Parish, Schedule } from '../../lib/supabase';
import { ArrowLeft, Church } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactSectionProps {
  onNavigate: (section: string) => void;
  isFullPage?: boolean;
}

// O componente PageHeader foi removido daqui
// para ser gerenciado no componente principal App.tsx.

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigate, isFullPage = false }) => {
  const [parish, setParish] = useState<Parish | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = [
    { id: 'sunday', label: 'Domingo', shortLabel: 'Dom' },
    { id: 'monday', label: 'Segunda-feira', shortLabel: 'Seg' },
    { id: 'tuesday', label: 'Terça-feira', shortLabel: 'Ter' },
    { id: 'wednesday', label: 'Quarta-feira', shortLabel: 'Qua' },
    { id: 'thursday', label: 'Quinta-feira', shortLabel: 'Qui' },
    { id: 'friday', label: 'Sexta-feira', shortLabel: 'Sex' },
    { id: 'saturday', label: 'Sábado', shortLabel: 'Sáb' }
  ];

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    setIsLoading(true);
    try {
      // Fetch parish data
      const { data: parishData, error: parishError } = await supabase
        .from('parishes')
        .select('*')
        .limit(1)
        .single();

      if (parishError && parishError.code !== 'PGRST116') {
        throw parishError;
      }

      if (parishData) {
        setParish(parishData);
      } else {
        // Default data
        const defaultParish: Parish = {
          id: '1',
          name: 'Catedral de São Miguel Arcanjo',
          history: '',
          founded_year: 1622,
          address: 'Praça Pe. Aleixo Monteiro Mafra, 11 - São Miguel Paulista, São Paulo - SP, 08010-000',
          phone: '(11) 2032-4160',
          email: 'contato@catedralsaomiguel.com.br',
          logo_url: null,
          cloudinary_public_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setParish(defaultParish);
      }

      // Fetch schedules
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true });

      if (schedulesError) throw schedulesError;
      
      if (schedulesData && schedulesData.length > 0) {
        setSchedules(schedulesData);
      } else {
        // Default schedules
        const defaultSchedules: Schedule[] = [
          {
            id: '1',
            day_of_week: 'sunday',
            time: '08:00',
            description: 'Missa Dominical',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            day_of_week: 'sunday',
            time: '10:00',
            description: 'Missa Solene',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            day_of_week: 'sunday',
            time: '19:00',
            description: 'Missa Vespertina',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '4',
            day_of_week: 'wednesday',
            time: '19:30',
            description: 'Missa de Quarta-feira',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '5',
            day_of_week: 'friday',
            time: '19:30',
            description: 'Missa de Sexta-feira',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: '6',
            day_of_week: 'saturday',
            time: '19:00',
            description: 'Missa de Sábado',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ];
        setSchedules(defaultSchedules);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simular envio (em produção, implementar com edge function ou serviço de email)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (parish?.phone) {
      const cleanPhone = parish.phone.replace(/\D/g, '');
      const message = encodeURIComponent('Olá! Gostaria de entrar em contato com a catedral.');
      window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
    }
  };

  const handleEmailClick = () => {
    if (parish?.email) {
      window.open(`mailto:${parish.email}`, '_blank');
    }
  };

  const handleMapClick = () => {
    if (parish?.address) {
      const encodedAddress = encodeURIComponent(parish.address);
      window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
    }
  };

  const getDayLabel = (dayId: string) => {
    return daysOfWeek.find(d => d.id === dayId)?.label || dayId;
  };

  const groupSchedulesByDay = () => {
    const grouped: { [key: string]: Schedule[] } = {};
    
    schedules.forEach(schedule => {
      if (!grouped[schedule.day_of_week]) {
        grouped[schedule.day_of_week] = [];
      }
      grouped[schedule.day_of_week].push(schedule);
    });

    return grouped;
  };

  const groupedSchedules = groupSchedulesByDay();

  if (isLoading) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando informações de contato...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header - apenas quando acessada como página individual */}
      {isFullPage && (
        <div className="text-white shadow-lg sticky top-0 z-50 safe-area-inset-top" style={{ background: 'linear-gradient(to right, var(--color-primary-from), var(--color-primary-to))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <Button
                  variant="outline"
                  onClick={() => onNavigate('home')}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 flex items-center gap-1 sm:gap-2 flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">Entre em Contato</h1>
                  <p className="text-sm sm:text-base truncate" style={{ color: 'var(--color-accent-2)' }}>
                    Fale conosco e tire suas dúvidas
                  </p>
                </div>
              </div>
              <Church className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0" style={{ color: 'var(--color-accent-2)' }} />
            </div>
          </div>
        </div>
      )}
      
      <section id="contact" className={`${isFullPage ? 'py-20' : 'py-8 lg:py-20'} bg-gradient-to-b from-gray-50 to-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da seção - apenas na página inicial */}
          {!isFullPage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent" style={{
                background: 'linear-gradient(to right, var(--color-primary-from), var(--color-secondary-from))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
              }}>
                Entre em Contato
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-dark)' }}>
                Fale conosco e tire suas dúvidas
              </p>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informações de Contato e Horários */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Informações Principais */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <MessageCircle className="h-6 w-6" style={{ color: 'var(--color-primary-from)' }} />
                  Informações de Contato
                </h3>

                <div className="space-y-4">
                  {parish?.address && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={handleMapClick}>
                      <MapPin className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: 'var(--color-primary-from)' }} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">Endereço</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{parish.address}</p>
                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Clique para ver no mapa
                        </p>
                      </div>
                    </div>
                  )}

                  {parish?.phone && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={handleWhatsAppClick}>
                      <Phone className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: 'var(--color-primary-from)' }} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">Telefone</h4>
                        <p className="text-gray-600 text-sm">{parish.phone}</p>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          Clique para WhatsApp
                        </p>
                      </div>
                    </div>
                  )}

                  {parish?.email && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={handleEmailClick}>
                      <Mail className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: 'var(--color-primary-from)' }} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">E-mail</h4>
                        <p className="text-gray-600 text-sm">{parish.email}</p>
                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Clique para enviar e-mail
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botões de Ação Rápida */}
                <div className="grid sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleWhatsAppClick}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.5 3.5C18.25 1.25 15.2 0 12 0S5.75 1.25 3.5 3.5 0 8.8 0 12s1.25 6.25 3.5 8.5S8.8 24 12 24c2.424 0 4.761-.722 6.75-2.087l5.25 1.312-1.312-5.25C23.278 16.761 24 14.424 24 12c0-3.2-1.25-6.25-3.5-8.5zM12 21.6c-2.1 0-4.1-.6-5.8-1.7l-.4-.3-4.2 1.1 1.1-4.2-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8 0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm5.3-7.2c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/>
                    </svg>
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleEmailClick}
                    className="flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    E-mail
                  </Button>
                </div>
              </Card>

              {/* Horários das Celebrações */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Clock className="h-6 w-6" style={{ color: 'var(--color-primary-from)' }} />
                  Horários das Celebrações
                </h3>

                {schedules.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Horários serão disponibilizados em breve
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {daysOfWeek.map(day => {
                      const daySchedules = groupedSchedules[day.id];
                      if (!daySchedules || daySchedules.length === 0) return null;

                      return (
                        <div key={day.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200">
                              <span className="font-bold text-xs text-black">
                                {day.shortLabel}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">
                                {day.label}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {daySchedules.map((schedule, index) => (
                                  <span key={index} className="text-xs text-gray-800 font-medium">
                                    {schedule.time}
                                    {schedule.description && ` (${schedule.description})`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('celebrations')}
                    className="flex items-center gap-2"
                    style={{ color: 'var(--color-primary-from)', borderColor: 'var(--color-primary-from)' }}
                  >
                    <Calendar className="h-4 w-4" />
                    Ver Escala Completa
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Formulário de Contato e Informações Adicionais */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Formulário de Contato */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Send className="h-6 w-6" style={{ color: 'var(--color-primary-from)' }} />
                  Envie uma Mensagem
                </h3>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone (opcional)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assunto
                      </label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="informacoes">Informações Gerais</option>
                        <option value="batismo">Batismo</option>
                        <option value="casamento">Casamento</option>
                        <option value="primeira-comunhao">Primeira Comunhão</option>
                        <option value="crisma">Crisma</option>
                        <option value="pastoral">Pastorais</option>
                        <option value="eventos">Eventos</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={6}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        placeholder="Escreva sua mensagem aqui..."
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2"
                    size="lg"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Responderemos sua mensagem o mais breve possível
                  </p>
                </form>
              </Card>

              {/* Onde Estamos */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <MapPin className="h-6 w-6" style={{ color: 'var(--color-primary-from)' }} />
                  Onde Estamos
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Endereço</h4>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {parish?.address || 'Praça Pe. Aleixo Monteiro Mafra, 11 - São Miguel Paulista, São Paulo - SP, 08010-000'}
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleMapClick}
                      className="w-full flex items-center justify-center gap-2"
                      style={{ color: 'var(--color-primary-from)', borderColor: 'var(--color-primary-from)' }}
                    >
                      <MapPin className="h-4 w-4" />
                      Ver no Google Maps
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Informações Pastorais */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-3">
                  <Heart className="h-6 w-6" style={{ color: 'var(--color-secondary-from)' }} />
                  Atendimento Pastoral
                </h3>
                
                <div className="space-y-3 text-sm" style={{ color: 'var(--color-secondary-from)' }}>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-from)' }}></span>
                    <span><strong>Confissões:</strong> Sábados das 18h às 18h45 e domingos 30 min antes das missas</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-from)' }}></span>
                    <span><strong>Atendimento Pastoral:</strong> Segunda a sexta, das 9h às 17h (agendar)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-from)' }}></span>
                    <span><strong>Emergências:</strong> 24 horas via telefone</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary-from)' }}></span>
                    <span><strong>Sacramentos:</strong> Agendar com antecedência</span>
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t" style={{ borderTopColor: 'var(--color-primary-from)' }}>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('pastorals')}
                    className="w-full flex items-center justify-center gap-2 hover:opacity-80 border-2"
                    style={{ 
                      color: 'var(--color-secondary-from)', 
                      borderColor: 'var(--color-primary-from)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Users className="h-4 w-4" />
                    Conhecer Nossas Pastorais
                  </Button>
                </div>
              </Card>

              {/* Redes Sociais */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <MessageCircle className="h-6 w-6" style={{ color: 'var(--color-primary-from)' }} />
                  Siga-nos
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://wa.me/55${parish?.phone?.replace(/\D/g, '')}`, '_blank')}
                    className="flex items-center justify-center gap-2 hover:opacity-80"
                    style={{ color: 'var(--color-primary-from)' }}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.5 3.5C18.25 1.25 15.2 0 12 0S5.75 1.25 3.5 3.5 0 8.8 0 12s1.25 6.25 3.5 8.5S8.8 24 12 24c2.424 0 4.761-.722 6.75-2.087l5.25 1.312-1.312-5.25C23.278 16.761 24 14.424 24 12c0-3.2-1.25-6.25-3.5-8.5zM12 21.6c-2.1 0-4.1-.6-5.8-1.7l-.4-.3-4.2 1.1 1.1-4.2-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8 0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm5.3-7.2c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/>
                    </svg>
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.facebook.com/catedralsaomiguel', '_blank')}
                    className="flex items-center justify-center gap-2 hover:opacity-80"
                    style={{ color: 'var(--color-primary-from)' }}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.instagram.com/catedralsaomiguel', '_blank')}
                    className="flex items-center justify-center gap-2 hover:opacity-80"
                    style={{ color: 'var(--color-primary-from)' }}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Footer com Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Card className="p-6 bg-gray-100">
              {/* Logo do rodapé */}
              <div className="text-center mb-4">
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
                {/* Logo do rodapé */}
                {parish?.logo_url_dark ? (
                  <img
                    src={parish.logo_url_dark}
                    alt="Logo da Catedral"
                    className="w-16 h-auto object-contain opacity-80"
                  />
                ) : parish?.logo_url ? (
                  <img
                    src={parish.logo_url}
                    alt="Logo da Catedral"
                    className="w-16 h-auto object-contain opacity-80"
                  />
                ) : (
                  <img
                    src="/footer.webp"
                    alt="Logo da Catedral"
                    className="w-24 h-auto object-contain opacity-80"
                  />
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600 mt-4">
                <span>© 2025 Catedral de São Miguel Arcanjo</span>
                <span className="hidden sm:inline">•</span>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-red-800 transition-colors underline"
                >
                  Política de Privacidade
                </button>
                <span className="hidden sm:inline">•</span>
                <button
                  onClick={() => onNavigate('terms-of-use')}
                  className="hover:text-red-800 transition-colors underline"
                >
                  Termos de Uso
                </button>
                <span className="hidden sm:inline">•</span>
                <span>Desenvolvido por: <a href="https://instagram.com/guthierresc" target="_blank" rel="noopener noreferrer" className="hover:text-red-800 transition-colors font-medium">Sem. Guthierres</a></span>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};