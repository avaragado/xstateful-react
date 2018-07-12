import styled from 'styled-components';

const Button = styled('button')`
    padding: 0.5em 1em;
    background-color: ${props => props.bg};
    color: ${props => props.color};
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
`;

export default Button;
