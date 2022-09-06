import { editorViewCtx, parserCtx } from '@milkdown/core';
import { Slice } from '@milkdown/prose/model';
import { EditorRef, ReactEditor, useEditor } from '@milkdown/react';

import React, { forwardRef } from 'react';

import { createEditor } from './createEditor';
import { Content, useLazy } from './useLazy';
type Props = {
  content: Content;
  readOnly?: boolean;
  onChange?: (markdown: string) => void;
};

export type MarkdownEditorRef = { update: (markdown: string) => void };

// eslint-disable-next-line react/display-name
const MarkdownEditor = forwardRef<MarkdownEditorRef, Props>(
  ({ content, readOnly, onChange }, ref) => {
    const editorRef = React.useRef<EditorRef>(null);
    const [editorReady, setEditorReady] = React.useState(false);
    const [loading, md] = useLazy(content);

    React.useImperativeHandle(ref, () => ({
      update: (markdown: string) => {
        if (!editorReady || !editorRef.current) return;
        const editor = editorRef.current.get();
        if (!editor) return;
        editor.action((ctx) => {
          const view = ctx.get(editorViewCtx);
          const parser = ctx.get(parserCtx);
          const doc = parser(markdown);
          if (!doc) return;
          const state = view.state;
          view.dispatch(
            state.tr.replace(
              0,
              state.doc.content.size,
              new Slice(doc.content, 0, 0)
            )
          );
        });
      },
    }));

    const editor: any = useEditor(
      (root) => createEditor(root, md, readOnly, setEditorReady, onChange),
      [readOnly, md, onChange]
    );

    return loading ? <div /> : <ReactEditor ref={editorRef} editor={editor} />;
  }
);

export default MarkdownEditor;
