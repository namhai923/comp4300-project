import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Stack, Box, Divider, useMediaQuery } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/loader/Loader';
import ConverationHeader from './ConversationHeader';
import ConversationFooter from './ConversationFooter';
import { TextMsg } from './ConversationElement';
import { useGetConversationQuery } from 'app/features/messenger/messengerApiSlice';
import config from 'assets/data/config';

import { gun } from 'app/gunUtil';
import store from 'app/store';
import jwtDecode from 'jwt-decode';

const Conversation = (props) => {
    let { currentConversation, currentName, currentActive, handleChatToggle, chatOpened } = props;
    let theme = useTheme();
    let peerMode = useSelector((state) => state.value.peerMode);
    let [peerMessages, setPeerMessages] = useState([]);

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    let { data, isLoading, isSuccess, isError, error } = useGetConversationQuery(currentConversation, {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        skip: !currentConversation
    });

    const [scrollEl, setScrollEl] = useState();

    useEffect(() => {
        if (peerMode) {
            let { token } = store.getState().auth;
            let { userName } = jwtDecode(token);
            let messages = [];
            gun.get('users')
                .get(userName)
                .get(currentConversation)
                .map()
                .once(function (message, id) {
                    messages = [...messages.slice(-100), { ...message, _id: id }].sort((a, b) => a.createdAt - b.createdAt);
                    setPeerMessages(messages);
                    console.log(Date.now());
                });
        }

        if (scrollEl) {
            // Set the scroll position to the bottom
            scrollEl.scrollTop = scrollEl.scrollHeight;
        }
    }, [scrollEl, currentConversation, data, peerMode]);

    let content;

    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess) {
        content = (
            <Stack height="75vh">
                <Stack spacing={2}>
                    <ConverationHeader
                        currentConversation={currentConversation}
                        currentName={currentName}
                        currentActive={currentActive}
                        handleChatToggle={handleChatToggle}
                        chatOpened={chatOpened}
                    />
                    <Divider sx={{ my: 0 }} />
                </Stack>

                <PerfectScrollbar containerRef={setScrollEl}>
                    <Box p={matchDownMd ? 1 : 3}>
                        <Stack spacing={matchDownMd ? 1 : 3}>
                            {(peerMode ? peerMessages : data).map((messageProps, idx) => (
                                <TextMsg key={idx} messageProps={messageProps} />
                            ))}
                        </Stack>
                    </Box>
                </PerfectScrollbar>

                <ConversationFooter currentConversation={currentConversation} />
            </Stack>
        );
    }

    return content;
};

Conversation.propTypes = {
    currentConversation: PropTypes.string,
    currentName: PropTypes.string,
    currentActive: PropTypes.bool,
    handleChatToggle: PropTypes.func,
    chatOpened: PropTypes.bool
};

export default Conversation;
