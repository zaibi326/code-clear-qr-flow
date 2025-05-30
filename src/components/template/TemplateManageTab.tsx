
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Eye, Download, Trash2, Search, Grid, List, Copy, Edit } from 'lucide-react';
import { Template } from '@/types/template';

interface TemplateManageTabProps {
  templates: Template[];
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateDuplicate: (templateId: string) => void;
}

export const TemplateManageTab = ({ 
  templates, 
  onTemplateEdit, 
  onTemplateDelete, 
  onTemplateDuplicate 
}: TemplateManageTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image'>('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'pdf' && template.file?.type === 'application/pdf') ||
      (filterType === 'image' && template.file?.type !== 'application/pdf');
    return matchesSearch && matchesFilter;
  });

  const handlePreview = (template: Template) => {
    if (template.preview) {
      window.open(template.preview, '_blank');
    }
  };

  const handleDownload = (template: Template) => {
    if (template.file) {
      const url = URL.createObjectURL(template.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = template.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // For templates without files, create a download link for the preview
      const link = document.createElement('a');
      link.href = template.preview;
      link.download = `${template.name}.png`;
      link.click();
    }
  };

  if (templates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">Upload your first marketing template to get started</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF Only</option>
            <option value="image">Images Only</option>
          </select>
          
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      </div>

      {/* Templates Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                {template.file?.type === 'application/pdf' ? (
                  <div className="w-full h-48 bg-red-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-red-600" />
                    <span className="ml-2 text-red-600 font-medium">PDF</span>
                  </div>
                ) : (
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                {template.qrPosition && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    QR Ready
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Updated {template.updatedAt.toLocaleDateString()}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePreview(template)}
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onTemplateEdit(template)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onTemplateDuplicate(template.id)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{template.file?.type === 'application/pdf' ? 'PDF' : 'IMAGE'}</span>
                        <span>•</span>
                        <span>Updated {template.updatedAt.toLocaleDateString()}</span>
                        {template.qrPosition && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">QR Positioned</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onTemplateEdit(template)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(template)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onTemplateDuplicate(template.id)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onTemplateDelete(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
