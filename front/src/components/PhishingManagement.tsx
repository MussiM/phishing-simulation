import { useEffect } from "react";

import PhishingService from '../services/phishing.service';
import { useParams, useSearchParams } from "react-router-dom";

const PhishingManagement = () => {
    const [searchParams] = useSearchParams();
    const emailId = searchParams.get('emailId');
    
    useEffect(() => {
        try {
            PhishingService.updatePhishingAttempt(emailId || '')
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div>
            <h1>HO NO!!!!!</h1>
        </div>
    )
}

export default PhishingManagement;
