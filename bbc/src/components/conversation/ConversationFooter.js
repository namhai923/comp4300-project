import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { ButtonBase, IconButton, Stack, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { IconMoodSmile, IconBrandTelegram } from '@tabler/icons-react';

import { AvatarStyle, OutlineInputStyle } from 'components/styled-input';
import { useSendMessageMutation } from 'app/features/messenger/messengerApiSlice';

import { peerSendMessage } from 'app/gunUtil';
import store from 'app/store';
import jwtDecode from 'jwt-decode';

const ConversationFooter = (props) => {
    let { currentConversation } = props;
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    const peerMode = useSelector((state) => state.value.peerMode);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleEmojiClick(emoji) {
        const input = inputRef.current;

        if (input) {
            const selectionStart = input.selectionStart;
            const selectionEnd = input.selectionEnd;
            setValue(value.substring(0, selectionStart) + emoji + value.substring(selectionEnd));
            input.selectionStart = input.selectionEnd = selectionStart + 1;
        }
    }

    let [sendMessage] = useSendMessageMutation();
    let handleSendMessage = async () => {
        try {
            if (peerMode) {
                let { token } = store.getState().auth;
                let { userName } = jwtDecode(token);
                peerSendMessage(userName, currentConversation, value);
            } else {
                await sendMessage({ userName: currentConversation, message: value });
            }
            setValue('');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton onClick={handleClick}>
                <IconMoodSmile />
            </IconButton>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <Picker
                    theme={theme.palette.mode}
                    data={data}
                    onEmojiSelect={(emoji) => {
                        handleEmojiClick(emoji.native);
                    }}
                />
            </Popover>
            <OutlineInputStyle
                inputRef={inputRef}
                value={value}
                onChange={(event) => {
                    setValue(event.target.value);
                }}
                multiline
                placeholder="Write a message..."
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSendMessage(value);
                    }
                }}
                endAdornment={
                    <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }} onClick={handleSendMessage}>
                        <AvatarStyle color={theme.palette.primary} variant="rounded">
                            <IconBrandTelegram stroke={1.5} size="1.3rem" />
                        </AvatarStyle>
                    </ButtonBase>
                }
            />
        </Stack>
    );
};

ConversationFooter.propTypes = {
    currentConversation: PropTypes.string
};

export default ConversationFooter;
