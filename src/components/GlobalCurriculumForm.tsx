
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const colors = [
  { name: 'Deep Blue', hex: '#003296' },
  { name: 'Lime Green', hex: '#64C832' },
  { name: 'Teal', hex: '#009696' },
  { name: 'Pinkish Red', hex: '#C83264' },
  { name: 'Light Blue', hex: '#3296C8' },
  { name: 'Purple', hex: '#9664C8' },
  { name: 'Cyan', hex: '#00C8C8' },
  { name: 'Coral', hex: '#FF8064' },
  { name: 'Yellow', hex: '#FFC832' },
  { name: 'Mint Green', hex: '#64C896' },
  { name: 'Orange', hex: '#C89632' },
  { name: 'Violet', hex: '#C832C8' },
  { name: 'Soft Pink', hex: '#FF96C8' },
  { name: 'Sky Blue', hex: '#32C8FF' },
  { name: 'Turquoise', hex: '#32C8C8' },
  { name: 'Bright Green', hex: '#32C832' },
  { name: 'Red', hex: '#FF3232' },
  { name: 'Peach', hex: '#FF9664' },
  { name: 'Mustard Yellow', hex: '#C8C832' },
  { name: 'Bright Blue', hex: '#3296FF' },
  { name: 'Aqua', hex: '#32C8FF' },
  { name: 'Forest Green', hex: '#329632' },
  { name: 'Bright Orange', hex: '#FF9632' },
  { name: 'Muted Brown', hex: '#967F64' },
];

const subtopicSchema = z.object({
  name: z.string().min(1, 'Subtopic name is required'),
  hasMacro: z.boolean().default(false),
  macro: z.string().optional(),
});

const unitSchema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  subtopics: z.array(subtopicSchema).min(1, 'At least one subtopic is required'),
});

const formSchema = z.object({
  subject: z.string().min(1, 'Subject name is required'),
  color: z.string().min(1, 'Please select a color'),
  units: z.array(unitSchema).min(1, 'At least one unit is required'),
});

type FormData = z.infer<typeof formSchema>;

interface GlobalCurriculumFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

export const GlobalCurriculumForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}: GlobalCurriculumFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: initialData?.subject || '',
      color: initialData?.color || colors[0].hex,
      units: initialData?.units || [
        {
          name: '',
          subtopics: [{ name: '', hasMacro: false, macro: '' }]
        }
      ],
    },
  });

  const { fields: unitFields, append: appendUnit, remove: removeUnit } = useFieldArray({
    control: form.control,
    name: 'units',
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  const handleCancel = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Add New Curriculum
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Subject Name */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Subject Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter subject name (e.g., Indian Polity)" 
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    This is your main subject category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Selection */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Color Theme</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() => field.onChange(color.hex)}
                          className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                            field.value === color.hex 
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' 
                              : ''
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Choose a color to identify this subject.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Units */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <FormLabel className="text-white text-lg">Units</FormLabel>
                <Button
                  type="button"
                  onClick={() => appendUnit({ name: '', subtopics: [{ name: '', hasMacro: false, macro: '' }] })}
                  variant="outline"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Unit
                </Button>
              </div>

              {unitFields.map((unit, unitIndex) => (
                <UnitForm
                  key={unit.id}
                  unitIndex={unitIndex}
                  form={form}
                  onRemoveUnit={() => removeUnit(unitIndex)}
                  canRemoveUnit={unitFields.length > 1}
                />
              ))}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Curriculum
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface UnitFormProps {
  unitIndex: number;
  form: any;
  onRemoveUnit: () => void;
  canRemoveUnit: boolean;
}

const UnitForm = ({ unitIndex, form, onRemoveUnit, canRemoveUnit }: UnitFormProps) => {
  const { fields: subtopicFields, append: appendSubtopic, remove: removeSubtopic } = useFieldArray({
    control: form.control,
    name: `units.${unitIndex}.subtopics`,
  });

  return (
    <div className="border border-slate-600 rounded-lg p-4 mb-4 bg-slate-750">
      <div className="flex items-center justify-between mb-3">
        <FormField
          control={form.control}
          name={`units.${unitIndex}.name`}
          render={({ field }) => (
            <FormItem className="flex-1 mr-4">
              <FormLabel className="text-white">Unit {unitIndex + 1} Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter unit name (e.g., Constitutional Framework)"
                  {...field}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {canRemoveUnit && (
          <Button
            type="button"
            onClick={onRemoveUnit}
            variant="outline"
            size="sm"
            className="bg-red-600 hover:bg-red-700 border-red-600 text-white mt-6"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="ml-4">
        <div className="flex items-center justify-between mb-3">
          <FormLabel className="text-white">Subtopics</FormLabel>
          <Button
            type="button"
            onClick={() => appendSubtopic({ name: '', hasMacro: false, macro: '' })}
            variant="outline"
            size="sm"
            className="bg-green-600 hover:bg-green-700 border-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Subtopic
          </Button>
        </div>

        {subtopicFields.map((subtopic, subtopicIndex) => (
          <div key={subtopic.id} className="border border-slate-600 rounded-lg p-3 mb-3 bg-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <FormField
                control={form.control}
                name={`units.${unitIndex}.subtopics.${subtopicIndex}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter subtopic name"
                        {...field}
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`units.${unitIndex}.subtopics.${subtopicIndex}.hasMacro`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                      >
                        {field.value ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                        Macro
                      </button>
                    </FormControl>
                  </FormItem>
                )}
              />

              {subtopicFields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeSubtopic(subtopicIndex)}
                  variant="outline"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`units.${unitIndex}.subtopics.${subtopicIndex}.hasMacro`}
              render={({ field }) => (
                field.value && (
                  <FormField
                    control={form.control}
                    name={`units.${unitIndex}.subtopics.${subtopicIndex}.macro`}
                    render={({ field: macroField }) => (
                      <FormItem className="mt-2">
                        <FormControl>
                          <Input
                            placeholder="Enter macro details (optional)"
                            {...macroField}
                            className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
