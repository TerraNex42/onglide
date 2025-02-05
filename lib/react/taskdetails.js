//
// The turnpoint list
//

import { Icon } from './htmlhelper.js';

import { useState } from 'react';
import { useTask, Spinner, Error } from './loaders.js';

import Collapse from 'react-bootstrap/Collapse';

//
export function TaskDetails({vc}) {
    const { data, isLoading, error } = useTask(vc);
    const [ open, setOpen ] = useState( false );

    if (isLoading) return <Spinner />
    if (error) return <Error />

    if( ! data || ! data.contestday ) {
	return (<>
		   <h4>No task</h4>
		</>);
    }
    const fClass = data.contestday.class;
    let taskDescription = '';
    switch(data.task.type) {
    case 'S':
        taskDescription = <>Speed Task: {data.task.distance}km</>;
        break;
    case 'D':
        taskDescription = <>Distance Handicap Task: {data.task.distance}km</>;
        break;
    case 'E':
        taskDescription = <>e3Glide Distance Handicap Task: {data.task.distance}km</>;
        break;
		case 'A':
			if(data.task.duration.substring(1,5) == '0:00') {
				taskDescription = <>Assigned Area Task</>;
			}
			else {
				taskDescription = <>Assigned Area Task: {data.task.duration.substring(1,5)} hours</>;
			}
        break;
    }

    if(data.contestday.status == 'Z') {
        taskDescription = 'Scrubbed';
    }

    return (
		<>
        <div className={'d-lg-inline d-none'}>
            <h5>{taskDescription}
                <span className="pull-right">
                    <a href="#" onClick={() => setOpen(!open)}
                       title={open?"Hide Task Details":"Show Task Details"}
                       aria-controls="task-collapse"
                       aria-expanded={open}>

                        <Icon type="tasks"/>
                        <Icon type="caret-down"/>
                    </a>
                </span>
            </h5>

            <Collapse in={open}>
                <div id="task-collapse">
					<h5>{data.classes.classname}</h5>
					<p>{data.contestday.displaydate}</p>
                    <Tasklegs legs={data.legs}/>

					{data.contestday.notes?.length > 0 &&
					 <>
						 <hr/>
						 <div>{data.contestday.notes}</div>
					 </>
					}
				</div>
			</Collapse>
			<hr/>
        </div>
			</>
    );
}


// Internal: details on the leg
function Tasklegs(props) {
    return (
        <table className="table table-condensed" style={{marginBottom:'0px'}}>
			<thead>
				<tr>
					<td colSpan={2}>Turnpoint</td>
					<td>Bearing</td>
					<td>Leg Length</td>
					<td>TP Radius</td>
				</tr>
			</thead>
            <tbody>
            {props.legs.map( (leg) => <tr key={leg.legno}>
                             <td>
                             {leg.legno}:{leg.ntrigraph}
                             </td>
                             <td>{leg.nname}</td>
                             <td>{leg.legno !== 0 ? (leg.bearing+"° "):""}</td>
                             <td>{leg.legno !== 0 ? (Math.round(leg.length*10)/10)+' km' : ''}</td>
                             <td>{leg.r1 !== 0 ? (Math.round(leg.r1*10)/10)+' km' : ''}</td>
			     </tr>
                )}
            </tbody>
        </table>
    );

}
