import React, {useState} from 'react'
import Navbar from '../components/Navbar';
import SignModal from '../components/Modals/SignModal.js';
import ProjectPopup from '../components/Modals/RClickProject.js';
import styled from 'styled-components';
import { Sidebar } from '../components/Sidebar/index.js';
import { Colors } from '../components/Navbar/NavbarElements.js';
import ProjectModal from '../components/Modals/AddProjectModal.js';
import Body from '../components/Main/index.js'; 
import { Route, Switch,Redirect, useRouteMatch } from 'react-router-dom';
import TimerComponent from '../components/Timer/TimerComponent.js';

const HomeContainer = styled.div`
    position: relative;
`
const BodyContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 4fr;
    height: 95vh;
`



const Home = () => {
    // Sign In/Sign Up modal state
    const [showSignModal, setSignInUpModal] = useState(false);
    const toggleModal = () => {
        setSignInUpModal(prev => !prev);
    }

    // The add project popup state
    const [ showAddProject, setShowAddProject] = useState(false);
    const toggleAddProject = function() {
        setShowAddProject(prev => !prev);
    } 

    // The edit project popup state(is it open or not)
    const [ showEditProject, setShowEditProject] = useState(false);
    const toggleEditProject = function(e) {
        setShowEditProject(prev => !prev);
    } 

    // Selected project when right clicking on one of the projects on the sidebar
    const [selectedContextProject, setSelectedProject] = useState(0); 
    const toggleSelectedProject = function(value) {
        setSelectedProject(() => value);
    }

    // State for determining the position of the popup when right clicking
    const [xPos, setX] = useState("50%");
    const [yPos, setY] = useState("50%");
    const [defaultProject, setDefaultProject] = useState(0);
    const {isOpen: isProjectPopupOpen, toggleModal : changeProjectPopup} = usePopup((e) => {
        setX(() => e.clientX +"px");
        setY(() => e.clientY +"px");
        const id = e.currentTarget.id;
        setDefaultProject(() => id);
        toggleSelectedProject(id);
    });

    const [isMinimized, setMinimization] = useState(true);
    const [currentRunningTodo, setRunningProject] = useState(0);
    
    const {path, url} = useRouteMatch();

    const time = new Date();
    time.setSeconds(time.getSeconds() + 50 * 60);

    const [currentMenu, setCurrentMenu] = useState('Today');

    return (
        <HomeContainer onClick={changeProjectPopup}>
            <Navbar toggleModal={toggleModal} />
            <BodyContainer>
                <Sidebar  togglePopup={changeProjectPopup} toggleProjectModal={toggleAddProject} 
                currentMenu={currentMenu} setCurrentMenu={setCurrentMenu} />
                <Switch>
                    <Route  path={`${url}/:menu`} component={() => <Body
                    setRunningProject={setRunningProject}
                    setMinimization={setMinimization}/>} />
                    <Redirect to={`${path}/Today`} />
                </Switch>
            </BodyContainer>
            <SignModal showModal={showSignModal} toggleModal={toggleModal}
            currentMenu={currentMenu}/>
            <ProjectPopup isPopupOpen={isProjectPopupOpen} xPos={xPos} yPos={yPos} 
            selectedContextProject={selectedContextProject} 
            toggleEditProject={toggleEditProject} />
            <ProjectModal isProjectModalOpen={showAddProject} toggleProjectModal={toggleAddProject} 
            toAdd={true} defaultProject={false}/>
            <ProjectModal isProjectModalOpen={showEditProject} 
            toggleProjectModal={toggleEditProject} toAdd={false}
             defaultProject={defaultProject} setDefaultProject={setDefaultProject}/>
            {currentRunningTodo ? <TimerComponent expiryTimestamp={time} isMinimized={isMinimized} 
                setMinimization={setMinimization} 
                currentRunningTodo={currentRunningTodo}
                setRunningProject={setRunningProject}/> : null}
        </HomeContainer>
    )
}

const usePopup = function(additionalLogic) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = function(e) {
        if(e.type === 'click'){
            setIsOpen(() => false);
        }
        else{
            e.preventDefault();
            setIsOpen(prev => !prev);
            additionalLogic(e);
        }
    }

    return {isOpen, toggleModal};
}

export default Home;
