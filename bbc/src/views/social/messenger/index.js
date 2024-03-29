import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Box, ButtonBase, Stack, Typography, Grid, Paper, Switch, FormControlLabel, useMediaQuery } from '@mui/material';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import Loader from 'components/loader/Loader';
import Conversation from 'components/conversation/Conversation';
import ChatDrawer from 'components/chat/ChatDrawer';

import { gridSpacing } from 'assets/data/constant';
import SubCard from 'components/cards/SubCard';
import noConversation from 'assets/images/bison.png';
import { useGetContactsQuery } from 'app/features/contact/contactApiSlice';
import config from 'assets/data/config';
import { AvatarStyle } from 'components/styled-input';
import { setChat } from 'app/features/customize/customizeSlice';

import { setValue } from 'app/features/value/valueSlice';

const Messeger = () => {
    const theme = useTheme();
    let dispatch = useDispatch();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'));

    let peerMode = useSelector((state) => state.value.peerMode);

    let currentConversation = useSelector((state) => state.value.currentConversation);
    let chatOpened = useSelector((state) => state.customization.chatOpened);

    const handleChatToggle = () => {
        let action = setChat(!chatOpened);
        dispatch(action);
    };

    const handlePeerModeToggle = (event) => {
        dispatch(setValue({ type: 'peerMode', value: event.target.checked }));
    };

    // useEffect(() => {
    //     async function peerData() {
    //         if (peerMode) {
    //             const alias = await user.get('alias');
    //             const userData = db.get(alias);
    //             console.log(userData);
    //         }
    //     }

    //     peerData();
    // }, [peerMode]);

    let {
        data: contacts,
        isLoading: isContactsLoading,
        isSuccess: isContactsSuccess,
        isError: isContactsError,
        error: contactsError
    } = useGetContactsQuery('contacts', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;
    if (isContactsLoading) content = <Loader />;

    if (isContactsError) {
        content = <p className="errmsg">{contactsError?.data?.message}</p>;
    }
    if (isContactsSuccess) {
        let currentName = currentConversation;
        let currentActive;
        if (currentConversation) {
            for (let contact of contacts) {
                if (contact.userName === currentConversation) {
                    currentName = `${contact.firstName} ${contact.lastName}`;
                    currentActive = contact.active;
                }
            }
        }

        content = (
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Paper>
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                            <Grid item>
                                <Typography align="center" variant="h3">
                                    Messenger
                                </Typography>
                            </Grid>
                            <Grid item>
                                <FormControlLabel control={<Switch checked={peerMode} onChange={handlePeerModeToggle} />} label="P2P" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex' }}>
                        <ChatDrawer
                            contacts={contacts}
                            currentConversation={currentConversation}
                            currentName={currentName}
                            currentActive={currentActive}
                            chatOpened={!matchDownLg ? chatOpened : !chatOpened}
                            chatToggle={handleChatToggle}
                        />

                        <SubCard sx={{ flexGrow: 1 }}>
                            {currentConversation !== null ? (
                                <Conversation
                                    currentConversation={currentConversation}
                                    currentName={currentName}
                                    currentActive={currentActive}
                                    handleChatToggle={handleChatToggle}
                                    chatOpened={chatOpened}
                                />
                            ) : (
                                <>
                                    <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        <AvatarStyle variant="rounded" color={theme.palette.secondary} onClick={handleChatToggle}>
                                            {chatOpened ? (
                                                <IconChevronLeft stroke={1.5} size="1.3rem" />
                                            ) : (
                                                <IconChevronRight stroke={1.5} size="1.3rem" />
                                            )}
                                        </AvatarStyle>
                                    </ButtonBase>

                                    <Stack height="75vh" spacing={2} alignItems="center" justifyContent="center">
                                        <img
                                            src={noConversation}
                                            alt="Bison Bank of Canada"
                                            width={matchDownMd ? '100' : '300'}
                                            height={matchDownMd ? '100' : '300'}
                                        />
                                        <Typography variant="subtitle2">Select a conversation or start a new one</Typography>
                                    </Stack>
                                </>
                            )}
                        </SubCard>
                    </Box>
                </Grid>
            </Grid>
        );
    }
    return content;
};

export default Messeger;
