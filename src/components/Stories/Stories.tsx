import React from 'react';

import {block} from '../utils/cn';
import {Modal, ModalCloseReason} from '../Modal';
import {Button} from '../Button';
import {ButtonClose} from '../Dialog/ButtonClose/ButtonClose';
import {Link} from '../Link';
import {MediaRenderer} from './components';
import {Story} from './types';
import i18n from './i18n';

import './Stories.scss';

const b = block('stories');

export interface StoriesProps {
    open: boolean;
    stories: Story[];
    onClose?: (
        event: MouseEvent | KeyboardEvent | React.MouseEvent<HTMLElement, MouseEvent>,
        reason: ModalCloseReason | 'closeButtonClick',
    ) => void;
    startStoryIndex?: number;
    onPreviousClick?: (storyIndex: number) => void;
    onNextClick?: (storyIndex: number) => void;
}

export const Stories: React.FC<StoriesProps> = ({
    open,
    onClose,
    stories,
    onPreviousClick,
    onNextClick,
    ...props
}) => {
    const [visible, setVisible] = React.useState(open);
    const startStoryIndex = React.useMemo(() => {
        if (
            typeof props.startStoryIndex === 'undefined' ||
            props.startStoryIndex < 0 ||
            props.startStoryIndex >= stories.length
        ) {
            return 0;
        }

        return props.startStoryIndex;
    }, [props.startStoryIndex, stories]);
    const [currentStoryIndex, setCurrentStoryIndex] = React.useState(startStoryIndex);

    const currentStory = stories[currentStoryIndex];
    const isFirstStory = currentStoryIndex === 0;
    const isLastStory = currentStoryIndex === stories.length - 1;
    const hasNextStory = !isLastStory;
    const hasPreviousStory = !isFirstStory;

    const handleClose = React.useCallback<NonNullable<StoriesProps['onClose']>>(
        (event, reason) => {
            setVisible(false);
            onClose?.(event, reason);
        },
        [onClose],
    );

    const handleGotoPrevious = React.useCallback(() => {
        if (currentStoryIndex > 0) {
            const newIndex = currentStoryIndex - 1;
            setCurrentStoryIndex(newIndex);
            onPreviousClick?.(newIndex);
        }
    }, [currentStoryIndex, onPreviousClick]);

    const handleGotoNext = React.useCallback(() => {
        if (currentStoryIndex < stories.length - 1) {
            const newIndex = currentStoryIndex + 1;
            setCurrentStoryIndex(newIndex);
            onNextClick?.(newIndex);
        }
    }, [currentStoryIndex, stories, onNextClick]);

    React.useEffect(() => {
        setVisible(open);
    }, [open]);

    return (
        <Modal open={visible} onClose={handleClose} className={b('modal')}>
            <div className={b()}>
                <div className={b('container')} style={styles.container}>
                    {currentStory && (
                        <React.Fragment>
                            <div className={b('left-pane')}>
                                <div className={b('counter')}>
                                    {i18n('label_counter', {
                                        current: currentStoryIndex + 1,
                                        all: stories.length,
                                    })}
                                </div>
                                <div className={b('text-block')}>
                                    {currentStory.title ? (
                                        <div className={b('text-header')}>{currentStory.title}</div>
                                    ) : null}
                                    {currentStory.description ? (
                                        <div className={b('text-content')}>
                                            {currentStory.description}
                                        </div>
                                    ) : null}
                                    {currentStory.url ? (
                                        <div className={b('story-link-block')}>
                                            <Link href={currentStory.url} target={'_blank'}>
                                                {i18n('label_more')}
                                            </Link>
                                        </div>
                                    ) : null}
                                </div>
                                <div className={b('controls-block')}>
                                    {hasPreviousStory && (
                                        <Button onClick={handleGotoPrevious} view="outlined">
                                            {i18n('label_back')}
                                        </Button>
                                    )}
                                    {(isFirstStory || isLastStory) && (
                                        <Button
                                            onClick={(event) =>
                                                handleClose(event, 'closeButtonClick')
                                            }
                                        >
                                            {i18n('label_close')}
                                        </Button>
                                    )}
                                    {hasNextStory && (
                                        <Button onClick={handleGotoNext} view="action">
                                            {i18n('label_next')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className={b('right-pane')}>
                                <ButtonClose
                                    onClose={(event) => handleClose(event, 'closeButtonClick')}
                                />
                                {currentStory.media && (
                                    <div className={b('media-block')}>
                                        <MediaRenderer media={currentStory.media} />
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </Modal>
    );
};

const styles = {
    container: {
        width: 1280,
        height: 640,
    },
};
