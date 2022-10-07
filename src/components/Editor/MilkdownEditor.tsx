import { ReactEditor, useEditor } from '@milkdown/react';

import { createEditor } from './createEditor';
type Props = {
  content: string;
  readOnly?: boolean;
  onChange?: (markdown: string) => void;
};

export type MarkdownEditorRef = { update: (markdown: string) => void };

const MarkdownEditor = ({ content, readOnly, onChange }: Props) => {
  const { editor } = useEditor(
    (root) => createEditor(root, content, readOnly, onChange),
    [content, readOnly, onChange]
  );
  return <ReactEditor editor={editor} />;
};

export default MarkdownEditor;
