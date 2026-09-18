import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = ()=>{
    return(
      <div>
          <div className="text-2xl text-center pt-8 border-t ">
            <Title text1={'ABOUT'} text2={'US'} />
          </div>
          
          <div className="my-10 flex flex-col md:flex-row gap-16">
            <img className="w-full md:max-w-112.5" src={assets.about_img} alt="" />
            <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit omnis molestiae animi quasi quisquam. Earum, mollitia animi! Fugiat rem porro voluptatem ipsam molestiae, laboriosam, ducimus illo corrupti, alias amet et!</p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est enim officia blanditiis, sequi aut laudantium provident magnam velit quis! Quis sequi eius exercitationem eum iusto quaerat natus incidunt vero ea.</p>
                <b className="text-gray-800">Our Mission</b>
                <p>Our mission at forever is to empower customers with choise,convenience, and confidence. We are dedicated to provide a seamless shopping experience that exceeds expectation, from browsing and ordering to delivery and beyond </p>
            </div>
          </div>

          <div className="text-xl py-4">
            <Title text1={'WHY'} text2={'CHOOSE US'} />
          </div>

          <div className="flex flex-col md:flex-row text-sm mb-20">
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                <b>Quality Assurance</b>
                <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum quam commodi illo, velit quibusdam tenetur voluptate temporibus quod exercitationem accusantium a cupiditate. Vero eum voluptates possimus fugit modi neque et.</p>
            </div>
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                <b>Convenience</b>
                <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum quam commodi illo, velit quibusdam tenetur voluptate temporibus quod exercitationem accusantium a cupiditate. Vero eum voluptates possimus fugit modi neque et.</p>
            </div>
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                <b>Exceptional Customer Service:</b>
                <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum quam commodi illo, velit quibusdam tenetur voluptate temporibus quod exercitationem accusantium a cupiditate. Vero eum voluptates possimus fugit modi neque et.</p>
            </div>

          </div>

          <NewsLetterBox />


      </div>
        
    )
}
export default About