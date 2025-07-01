import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface CreatePollFormProps {
  onCreatePoll: (title: string, description: string, options: string[]) => void;
}

const CreatePollForm = ({ onCreatePoll }: CreatePollFormProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(option => option.trim() !== '');
    if (title.trim() && validOptions.length >= 2) {
      onCreatePoll(title, description, validOptions);
      setTitle('');
      setDescription('');
      setOptions(['', '']);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('create.poll.form')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('poll.title')}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('poll.title.placeholder')}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t('poll.description')}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('poll.description.placeholder')}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('poll.options')}</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`${t('option.placeholder')} ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('add.option')}
            </Button>
          </div>

          <Button type="submit" className="w-full">
            {t('create.poll')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePollForm;
