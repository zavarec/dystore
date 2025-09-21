import React, { useEffect, useState } from 'react';

import type { GetServerSideProps, NextPage } from 'next';

import { Eye, Copy, Trash, Pencil, Plus } from '@phosphor-icons/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toast } from 'react-toastify';

import { FileUploadModal } from '@/components/admin/FileUploadModal';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { TableRowSkeleton } from '@/components/atoms/skeleton';
import { withManager } from '@/features/auth/with-manager';
import UploadsService from '@/services/uploads.service';
import {
  ActionsBar as SActionsBar,
  SearchInput as SSearchInput,
  AddButton as SAddButton,
  TableContainer as STableContainer,
  Table as STable,
  Th as STh,
  Td as STd,
  ActionButtons as SActionButtons,
  ActionButton as SActionButton,
  EmptyState as SEmptyState,
  Pagination as SPagination,
  PageButton as SPageButton,
} from '@/styles/pages/admin/admin-products-page.style';
import type { UploadedFile, FileListResponse } from '@/types/upload';

const AdminUploadsPage: NextPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null);
  const [editMeta, setEditMeta] = useState({ alt: '', description: '' });

  useEffect(() => {
    fetchFilesList();
  }, [currentPage, searchQuery]);

  const fetchFilesList = async () => {
    try {
      setLoading(true);
      const data: FileListResponse = await UploadsService.list();
      setFiles(data.files);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Ошибка загрузки файлов');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот файл?')) {
      return;
    }

    try {
      await UploadsService.remove(id);
      toast.success('Файл успешно удален');
      fetchFilesList();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Ошибка при удалении файла');
    }
  };

  const handleEdit = (file: UploadedFile) => {
    setEditingFile(file);
    setEditMeta({
      alt: file.alt || '',
      description: file.description || '',
    });
  };

  const handleSaveMeta = async () => {
    if (!editingFile) return;

    try {
      await UploadsService.updateMeta(editingFile.id, editMeta);
      toast.success('Метаданные обновлены');
      setEditingFile(null);
      fetchFilesList();
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Ошибка при обновлении файла');
    }
  };

  const handleUploaded = (uploadedFiles: UploadedFile[]) => {
    setShowUploadModal(false);
    fetchFilesList();
    toast.success(`Загружено ${uploadedFiles.length} файлов`);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL скопирован в буфер обмена');
    } catch (error) {
      console.error('Error copying URL:', error);
      toast.error('Ошибка при копировании URL');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mime: string): string => {
    if (mime.startsWith('image/')) return '🖼️';
    if (mime.startsWith('video/')) return '🎬';
    if (mime.startsWith('audio/')) return '🎵';
    if (mime === 'application/pdf') return '📕';
    if (mime.includes('zip') || mime.includes('tar')) return '🗜️';
    return '📄';
  };

  if (loading) {
    return (
      <AdminLayout title="Загрузки">
        <STableContainer>
          <STable>
            <thead>
              <tr>
                <STh>Превью</STh>
                <STh>Имя файла</STh>
                <STh>Тип</STh>
                <STh>Размер</STh>
                <STh>Статус</STh>
                <STh>Дата загрузки</STh>
                <STh>Действия</STh>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={7} />
              ))}
            </tbody>
          </STable>
        </STableContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Загрузки">
      <SActionsBar>
        <SSearchInput
          type="text"
          placeholder="Поиск файлов..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <SAddButton onClick={() => setShowUploadModal(true)}>
          <Plus size={20} />
          Загрузить файлы
        </SAddButton>
      </SActionsBar>

      <STableContainer>
        {files.length === 0 ? (
          <SEmptyState>
            <p>Файлы не найдены</p>
          </SEmptyState>
        ) : (
          <>
            <STable>
              <thead>
                <tr>
                  <STh>Превью</STh>
                  <STh>Имя файла</STh>
                  <STh>Тип</STh>
                  <STh>Размер</STh>
                  <STh>Статус</STh>
                  <STh>Дата загрузки</STh>
                  <STh>Действия</STh>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.id}>
                    <STd>
                      {file.mimetype.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.alt || file.filename}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                          }}
                        >
                          {getFileIcon(file.mimetype)}
                        </div>
                      )}
                    </STd>
                    <STd>
                      <div>
                        <div style={{ fontWeight: 500 }}>{file.filename}</div>
                        {file.alt && (
                          <div style={{ fontSize: 12, color: '#666' }}>Alt: {file.alt}</div>
                        )}
                      </div>
                    </STd>
                    <STd>{file.mimetype}</STd>
                    <STd>{formatFileSize(file.size)}</STd>
                    <STd>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          background: file.status === 'READY' ? '#d4edda' : '#f8d7da',
                          color: file.status === 'READY' ? '#155724' : '#721c24',
                        }}
                      >
                        {file.status}
                      </span>
                    </STd>
                    <STd>{new Date(file.createdAt).toLocaleDateString()}</STd>
                    <STd>
                      <SActionButtons>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            background: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '14px',
                          }}
                        >
                          <Eye size={16} />
                          Просмотр
                        </a>
                        <button
                          onClick={() => handleCopyUrl(file.url)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          <Copy size={16} />
                          Скопировать URL
                        </button>
                        <SActionButton $variant="edit" onClick={() => handleEdit(file)}>
                          <Pencil size={16} />
                          Изменить
                        </SActionButton>
                        <SActionButton $variant="delete" onClick={() => handleDelete(file.id)}>
                          <Trash size={16} />
                          Удалить
                        </SActionButton>
                      </SActionButtons>
                    </STd>
                  </tr>
                ))}
              </tbody>
            </STable>

            {totalPages > 1 && (
              <SPagination>
                <SPageButton
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Назад
                </SPageButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <SPageButton
                    key={page}
                    $active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </SPageButton>
                ))}

                <SPageButton
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Вперед
                </SPageButton>
              </SPagination>
            )}
          </>
        )}
      </STableContainer>

      {/* Модалка редактирования метаданных */}
      {editingFile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: 24,
              borderRadius: 8,
              width: '90%',
              maxWidth: 500,
            }}
          >
            <h3 style={{ margin: '0 0 16px' }}>Редактировать метаданные</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Alt текст:</label>
              <input
                type="text"
                value={editMeta.alt}
                onChange={e => setEditMeta(prev => ({ ...prev, alt: e.target.value }))}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Описание:</label>
              <textarea
                value={editMeta.description}
                onChange={e => setEditMeta(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  padding: 8,
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  minHeight: 80,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingFile(null)}
                style={{
                  padding: '8px 16px',
                  background: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleSaveMeta}
                style={{
                  padding: '8px 16px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно загрузки файлов */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={handleUploaded}
        accept={['image/*', 'application/pdf', 'video/*', 'audio/*']}
        maxFiles={20}
        maxSize={10 * 1024 * 1024} // 10MB
      />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
  };
};
export default withManager(AdminUploadsPage);
