import { ReactEditor, useEditor } from '@milkdown/react';

import React from 'react';

import { createEditor } from './createEditor';
type Props = {
  content: string;
  readOnly?: boolean;
  onChange?: (markdown: string) => void;
};

export type MarkdownEditorRef = { update: (markdown: string) => void };

const MarkdownEditor = ({ content, readOnly, onChange }: Props) => {
  const [editorReady, setEditorReady] = React.useState(false);
  const { editor, loading } = useEditor(
    (root) => createEditor(root, content, readOnly, setEditorReady, onChange),
    [content, readOnly, setEditorReady, onChange]
  );
  return <ReactEditor editor={editor} />;
};

export default MarkdownEditor;
