import React from "react";
import ClassHero from "../components/Hero/ClassHero";
import ClassesServices from "../components/Services/ClassesServices";
import ClassTiming from "../components/Services/ClassTiming";
import YogaStyles from "../components/Services/ClassYogaStyle";

const Classes = () => {
    return (
        <dir>
            <ClassHero />
            <ClassesServices />
            <ClassTiming />
            <YogaStyles />
        </dir>

    )


}
export default Classes