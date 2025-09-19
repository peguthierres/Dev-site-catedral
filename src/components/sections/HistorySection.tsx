import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Church, Users, Heart, BookOpen, Star, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { supabase, Parish } from '../../lib/supabase';

interface HistorySectionProps {
  onBack?: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ onBack }) => {
  const [parish, setParish] = useState<Parish | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchParishData();
  }, []);

  const fetchParishData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('parishes')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setParish(data);
      } else {
        const defaultParish: Parish = {
          id: '1',
          name: 'Catedral de São Miguel Arcanjo',
          history: 'A Catedral de São Miguel Arcanjo tem suas raízes profundas na história de São Miguel Paulista. Fundada em 1622, nossa catedral nasceu do fervor religioso dos primeiros colonizadores que se estabeleceram na região.\n\nAo longo dos séculos, a catedral passou por diversas transformações arquitetônicas e espirituais, sempre mantendo sua missão de ser um farol de fé para a comunidade local. Durante o período colonial, serviu como centro de evangelização para os povos indígenas da região.\n\nNo século XX, com o crescimento urbano de São Paulo, a catedral se adaptou às necessidades de uma comunidade em expansão, implementando novos programas pastorais e sociais. Hoje, ela continua sendo um símbolo de esperança e união para milhares de fiéis.\n\nNossa catedral não é apenas um edifício histórico, mas um lar espiritual onde gerações encontraram conforto, celebraram momentos especiais e fortaleceram sua fé. Cada pedra conta uma história de devoção, cada vitral reflete a luz da esperança que ilumina nossa comunidade há mais de 400 anos.',
          founded_year: 1622,
          address: 'Praça Pe. Aleixo Monteiro Mafra, 11 - São Miguel Paulista, São Paulo - SP, 08010-000',
          phone: '(11) 99999-9999',
          email: 'contato@catedralsaomiguel.com.br',
          logo_url: null,
          cloudinary_public_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setParish(defaultParish);
      }
    } catch (error) {
      console.error('Error fetching parish data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section id="history" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando história...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!parish) {
    return (
      <section id="history" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              História em construção
            </h3>
            <p className="text-gray-500">
              As informações históricas serão disponibilizadas em breve
            </p>
          </Card>
        </div>
      </section>
    );
  }

  const historyParagraphs = parish.history.split('\n').filter(p => p.trim());

  return (
    <section id="history" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Início
            </Button>
          </div>
        )}

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
            Nossa História
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-dark)' }}>
            Mais de {new Date().getFullYear() - parish.founded_year} anos de fé, tradição e comunidade
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 h-full">
              <div className="text-center mb-6">
                {parish.logo_url ? (
                  <img
                    src={parish.logo_url}
                    alt={parish.name}
                    className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg"
                  />
                ) : (
                  <Church className="h-32 w-32 text-red-800 mx-auto mb-4" />
                )}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{parish.name}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-red-800" />
                  <div>
                    <p className="text-sm text-gray-600">Fundada em</p>
                    <p className="font-bold text-red-800 text-lg">{parish.founded_year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Star className="h-6 w-6 text-blue-800" />
                  <div>
                    <p className="text-sm text-gray-600">Anos de história</p>
                    <p className="font-bold text-blue-800 text-lg">
                      {new Date().getFullYear() - parish.founded_year}+
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-800" />
                  <div>
                    <p className="text-sm text-gray-600">Comunidade</p>
                    <p className="font-bold text-green-800">Ativa e Unida</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-red-800" />
                <h3 className="text-2xl font-bold text-gray-800">Nossa Jornada de Fé</h3>
              </div>

              <div className="prose prose-lg max-w-none">
                {historyParagraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-gray-700 leading-relaxed mb-6 text-justify"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mt-8 p-6 bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-red-800 rounded-lg"
              >
                <blockquote className="text-lg italic text-gray-800 mb-3">
                  "Uma catedral não é feita apenas de pedras e vitrais, mas de fé, esperança e amor de cada pessoa que aqui encontra seu lar espiritual."
                </blockquote>
                <cite className="text-sm text-gray-600">— Tradição da Catedral de São Miguel Arcanjo</cite>
              </motion.div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Nossos Valores</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os pilares que sustentam nossa comunidade há gerações
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Amor Fraterno',
                description: 'Cultivamos o amor ao próximo como base de nossa comunidade',
                color: 'red'
              },
              {
                icon: Church,
                title: 'Tradição',
                description: 'Preservamos nossa rica herança espiritual e cultural',
                color: 'blue'
              },
              {
                icon: Users,
                title: 'Comunhão',
                description: 'Unidos na fé, formamos uma grande família em Cristo',
                color: 'green'
              },
              {
                icon: Star,
                title: 'Esperança',
                description: 'Mantemos viva a esperança em um futuro melhor para todos',
                color: 'amber'
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow duration-300">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    value.color === 'red' ? 'bg-blue-100' :
                    value.color === 'blue' ? 'bg-blue-100' :
                    value.color === 'green' ? 'bg-blue-100' :
                    'bg-blue-100'
                  }`}>
                    <value.icon className={`h-8 w-8 ${
                      'text-blue-800'
                    }`} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">{value.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
