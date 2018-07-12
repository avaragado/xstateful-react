import React from 'react';
import styled from 'styled-components';

import { xsf } from './LightMachine';

const Table = styled('table')`
    background-color: '#ccc';
    border-collapse: collapse;

    tbody {
        tr:nth-child(even) {
            background-color: #eee;
        }

        tr:nth-child(odd) {
            background-color: #ddd;
        }
    }

    th,
    td {
        text-align: left;
        vertical-align: top;
        padding: 0.5em 1em;
    }

    .right {
        text-align: right;
    }
`;

class Logger extends React.Component {
    state = {
        lines: [],
    };

    constructor() {
        super();

        this.dtStart = new Date();

        xsf.on('change', this.add);
    }

    stamp = () => Math.round((new Date() - this.dtStart) / 100) / 10;

    add = data =>
        this.setState(statePrev => ({
            lines: statePrev.lines.concat(this.line(data)),
        }));

    line = ({ state, extstate }) => ({
        ts: `${this.stamp()}s`,
        state: state ? state.toString() : 'null',
        activities: state
            ? Object.keys(state.activities)
                  .filter(act => state.activities[act])
                  .join(', ')
            : '-',
        extstate: JSON.stringify(extstate),
    });

    render() {
        return (
            <Table>
                <thead>
                    <tr>
                        <th className="right">Time</th>
                        <th>State</th>
                        <th>Activities</th>
                        <th>Ext State</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.lines.map(line => (
                        <React.Fragment key={line.ts}>
                            <tr>
                                <td className="right">{line.ts}</td>
                                <td>
                                    <code>{line.state}</code>
                                </td>
                                <td>
                                    <code>{line.activities}</code>
                                </td>
                                <td>
                                    <code>{line.extstate}</code>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        );
    }
}

export default Logger;
