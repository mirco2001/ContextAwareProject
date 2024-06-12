import { useState } from "react";

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

// FIXARE attualmente se non si modificano i valori è tutto standard

// ====== v_SETTING PER IL RATING_v ======
const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};
// ====== ^_SETTING PER IL RATING_^ ======


function MyForm() {
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(JSON.stringify(inputs));
    }

    return (
        <form onSubmit={handleSubmit}>

            <p>- Quanto è importante la disponibilità di scuole nel vicinato?
                <br />
                <StyledRating
                    name="vicinanza_scuole"
                    value={inputs.vicinanza_scuole || 3}
                    onChange={handleChange}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </p>
            <p>- Quanto è importante la disponibilità di palestre nel quartiere?
                <br />
                <StyledRating
                    name="vicinanza_palestre"
                    value={inputs.vicinanza_palestre || 3}
                    onChange={handleChange}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </p>
            <p>- Quanto è importante la disponibilità di luoghi di culto nel quartiere?
                <br />
                <StyledRating
                    name="vicinanza_luoghi_culto"
                    value={inputs.vicinanza_luoghi_culto || 3}
                    onChange={handleChange}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </p>
            <p>- Quanto è importante la presenza di ospedali nelle vicinanze?
                <br />
                <StyledRating
                    name="vicinanza_ospedali"
                    value={inputs.vicinanza_ospedali || 3}
                    onChange={handleChange}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </p>
            <p>- Quanto è importante la presenza di farmacie nelle vicinanze?
                <br />
                <StyledRating
                    name="vicinanza_farmacie"
                    value={inputs.vicinanza_farmacie || 3}
                    onChange={handleChange}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </p>
            <p>- Quanto è importante la presenza di stazioni dei mezzi pubblici nelle vicinanze?
                <br />
                <StyledRating
                    name="vicinanza_mezzi_publici"
                    value={inputs.vicinanza_mezzi_publici || 3}
                    onChange={handleChange}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </p>
            <p>- Quanto è importante la densità di parcheggi, con almeno uno ogni 100 metri nel quartiere?
                <br />
                <StyledRating
                    name="vicinanza_parcheggi"
                    value={inputs.vicinanza_parcheggi || 3}
                    onChange={handleChange}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </p>


            <input type="submit" />
        </form>
    )
}

export default MyForm;
