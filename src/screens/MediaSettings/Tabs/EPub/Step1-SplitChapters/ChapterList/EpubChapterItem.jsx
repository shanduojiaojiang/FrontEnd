import React from 'react';
import { epub, connectWithRedux } from 'screens/MediaSettings/controllers/epub';

import ChapterTitleButton from './ChapterTitleButton';
import EpubListItem from './EpubListItem';
import EpubSubChapterItem from './EpubSubChapterItem';
import ChapterTitle from '../../Step2-EditChapters/ChapterEditor/ChapterTitle';

const classNames = require('classnames');

function EpubChapterItem({
  chapter,
  chapterIndex,
  foldedIds=[],
  canUndoSplit=false,
}) {
  const fold = () => epub.sch.foldChapter(chapter.id);
  const unfold = () => epub.sch.unfoldChapter(chapter.id);

  const undoSplitChapter = () => epub.sch.undoSplitChapter(chapterIndex);
  const appendChapterAsSubChapter = () => epub.sch.appendChapterAsSubChapter(chapterIndex);
  const handleMouseOverChapterList = () => epub.sch.handleMouseOverChapterList(chapter);

  const handleChapterTitleChange = value => {
    epub.sch.handleChapterTitleChange(chapterIndex, value);
  }

  const isFolded = foldedIds.includes(chapter.id);
  
  let chaperClass = classNames('ct-d-c ee-sch-items', {
    fold: isFolded
  });

  return (
    <div 
      id={chapter.id}
      className={chaperClass}
      onMouseEnter={handleMouseOverChapterList}
    >
      <div className="ee-sch-ch-title-con ct-d-r-center-v">
        <ChapterTitle
          id={`sch-ch-${ chapter.id}`}
          value={chapter.title}
          onSave={handleChapterTitleChange}
          headingType="h2"
          className="ee-sch-ch-title"
        />

        <ChapterTitleButton
          show
          content={isFolded ? 'Expand' : 'Collapse'}
          color="transparent"
          icon={isFolded ? "expand_more" : "expand_less"}
          className="ee-sch-expand-btn"
          outlined={false}
          onClick={isFolded ? unfold : fold}
        />

        <ChapterTitleButton 
          show={canUndoSplit}
          content="Undo split"
          icon="unfold_less"
          className="ee-sch-ch-t-remove-btn"
          onClick={undoSplitChapter}
        />

        <ChapterTitleButton 
          show={canUndoSplit}
          content="As a Sub-Chapter"
          icon="chevron_right"
          className="ee-sch-ch-t-remove-btn ee-sch-ch-2"
          onClick={appendChapterAsSubChapter}
        />
      </div>

      {
        isFolded 
        ?
          <div className="ee-sch-ch-compact-txt">
            <div>
              {epub.getCompactText(chapter)} ...
            </div>
          </div>
        :
          <>
            <div className="ct-d-c ee-sch-i-ul">
              {chapter.items.map((item, itemIndex) => (
                <EpubListItem 
                  key={item.id} 
                  item={item} 
                  itemIndex={itemIndex}
                  chapterIndex={chapterIndex}
                  canSplit={itemIndex > 0}
                  canSubdivide
                />
          ))}
            </div>

            <div className="ct-d-c ee-sch-i-ul">
              {chapter.subChapters.map((subChapter, subChapterIndex) => (
                <EpubSubChapterItem
                  key={subChapter.id}
                  foldedIds={foldedIds}
                  subChapter={subChapter}
                  chapterIndex={chapterIndex}
                  subChapterIndex={subChapterIndex}
                  canUndoSubdivide={subChapterIndex === 0}
                  canUndoSplitSubChapter={subChapterIndex > 0}
                  canSplitAsNewChapter={chapter.items.length > 0 || subChapterIndex > 0}
                />
          ))}
            </div>
          </>
      }

    </div>
  );
}

export default connectWithRedux(
  EpubChapterItem,
  ['foldedIds']
);