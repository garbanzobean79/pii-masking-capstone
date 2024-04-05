import { Button, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from "react";
import NavBar from './NavBar';
import { isTokenExpired } from '../services/authService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Home() {

    const navigate = useNavigate();
    const [expanded, setExpanded] = useState<string | false>('');

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        console.log('Component loaded');
      }, []);

    const checkSignIn = () => {
        if (isTokenExpired(sessionStorage.getItem("jwtToken"))) {
            navigate('/sign-in');
        } else {
            navigate('/masking-text');
        }
    }

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 7, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="src/images/customer-avatar-identification.jpg" width={400} alt="Customer Avatar" />
                </Container>

                <Container>
                    <Typography variant='h4'>
                        Introducing <b>AnonyChat</b>, a privacy enhancing web application.
                    </Typography>
                    <Divider sx={{ mt:3 }}></Divider>
                    <Typography variant='h5' align="center" sx={{ mt: 3, mb: 1 }}>
                        Features
                    </Typography>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Utilizes a sophisticated natural language processing model</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Our platform employs a sophisticated natural language processing model from HuggingFace to anonymize user inquiries before sending them to ChatGPT for responses.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>Customized anonymity levels</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                AnonyChat prioritizes user privacy by allowing customization of the level of anonymity for each inquiry. This feature ensures that users have control over how much personal information is disclosed in their interactions.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography>Stores masking history</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                AnonyChat provides a comprehensive Masking History feature, allowing users to review past interactions for transparency and accountability. Masking history instances can be deleted if desired.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Container>
            </Container>

            {/* Container for the "Try it Out" button */}
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <Button variant="contained" onClick={checkSignIn}>Try it Out</Button>
            </Container>
        </>
    );
}

export default Home;
