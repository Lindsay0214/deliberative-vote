
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface CreatePollFormProps {
  onCreatePoll: (title: string, description: string, options: string[]) => void;
}

const CreatePollForm = ({ onCreatePoll }: CreatePollFormProps) => {
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
        <CardTitle>創建新投票</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">投票主題</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="輸入投票主題..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">描述（可選）</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="輸入投票描述..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">投票選項</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`選項 ${index + 1}`}
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
              新增選項
            </Button>
          </div>

          <Button type="submit" className="w-full">
            創建投票
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePollForm;
