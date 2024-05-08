import Providers from "@/app/providers";
import { CurrentConversationContextProvider } from "@/context/CurrentConversationContext";
import { EditVariantContextProvider } from "@/context/EditVariantContext";
import SnackbarContextProvider from "@/context/SnackbarContext";
import { UserContextProvider } from "@/context/UserContext";
import {
  adCreativeMessageMock,
  mockConversationState,
  mockGetConversation,
} from "../../../__mocks__/conversations";
import { ClientMessageContextProvider } from "@/context/ClientMessageContext";
import Snackbar from "@/components/Snackbar";
import AdItem from "@/components/ArtiBot/v2/AdItem/AdItem";
import { render, screen } from "@testing-library/react";
import { useSession } from "../../../__mocks__/user";
import { useGetAdSet } from "@/api/user";

jest.mock("@canvasjs/react-charts", () => jest.fn());
jest.mock("react-facebook-login/dist/facebook-login-render-props", () =>
  jest.fn()
);
jest.mock("@/components/ArtiBot/MessageItems/DeployButton", () => jest.fn());

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    query: {
      conversation_type: "662f76eca204580d19592ad4",
    },
    push: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((params: string) => {
      if (params === "conversation_id") {
        return "662f76eca204580d19592ad4";
      }
    }),
  })),
}));
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => useSession()),
}));

jest.mock("@/context/ConversationContext", () => ({
  ...jest.requireActual("@/context/ConversationContext"),
  useConversation: jest.fn(() => ({
    state: mockConversationState(),
    dispatch: jest.fn(),
  })),
}));

const mockedConversation = {
  id: "6610e227211119401c79b489",
  messages: [
    {
      id: "66289b62a367b6943de7ab8f",
      content:
        '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring raccoons typing on a computer to symbolize the innovative and engaging nature of EMS training. The ad aims to appeal to women in the 25-50 age group by showcasing the unconventional and fun aspects of EMS workouts in a visually interesting manner.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Join the raccoon squad for EMS success!",\n      "imageDescription": "The ad portrays raccoons typing on a computer with the text \'EMS Magic\' displayed above them. It presents a whimsical and humorous scene that symbolizes the innovative approach of EMS training, capturing attention in a unique and entertaining way.",\n      "adOrientation": "Whimsical and engaging theme",\n      "rationale": "This ad leverages the charm and curiosity associated with raccoons to create a memorable and light-hearted connection to EMS technology, appealing to the target audience\'s sense of fun and creativity.",\n      "text": "Step into the world of EMS magic at our Long Island City gym! Let the raccoon squad guide you on a journey to fitness success with high-intensity workouts and innovative training techniques. Join the fun today!",\n      "campaignName":"RaccoonFit Adventures",\n      "campaignObjective":"engagement",\n      "adsetName":"Raccoon Revolution",\n      "adName":"Magic Typing"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Uncover the secret to fitness with the raccoon crew!",\n      "imageDescription": "The video ad features raccoons typing on a computer interspersed with clips of individuals engaged in EMS training. The text \'EMS Discovery\' is highlighted throughout the video, creating a playful and intriguing visual narrative that emphasizes the innovative nature of EMS workouts.",\n      "adOrientation": "Playful and intriguing theme",\n      "rationale": "This video ad combines the antics of raccoons with the intensity of EMS training to create an engaging and memorable storyline, drawing viewers into the world of fitness exploration and excitement.",\n      "text": "Embark on a fitness journey like no other with the raccoon crew at our Long Island City gym! Discover the secret to successful workouts with EMS technology and experience the joy of transformative fitness. Join the adventure today!",\n      "campaignName":"RaccoonFitness Quest",\n      "campaignObjective":"engagement",\n      "adsetName":"Discovery Crew",\n      "adName":"Fit Explorers"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads featuring raccoons typing on a computer to symbolize the innovative and fun nature of EMS training for women in the 25-50 age group."\n}',
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-24T05:41:07.301Z",
      updatedAt: "2024-04-24T05:41:07.301Z",
      adCreatives: [
        {
          id: "66289b737171bbf59869a696",
          conversationId: "6610e227211119401c79b489",
          adObjective:
            "To create engaging ads featuring raccoons typing on a computer to symbolize the innovative and fun nature of EMS training for women in the 25-50 age group.",
          json: '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring raccoons typing on a computer to symbolize the innovative and engaging nature of EMS training. The ad aims to appeal to women in the 25-50 age group by showcasing the unconventional and fun aspects of EMS workouts in a visually interesting manner.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Join the raccoon squad for EMS success!",\n      "imageDescription": "The ad portrays raccoons typing on a computer with the text \'EMS Magic\' displayed above them. It presents a whimsical and humorous scene that symbolizes the innovative approach of EMS training, capturing attention in a unique and entertaining way.",\n      "adOrientation": "Whimsical and engaging theme",\n      "rationale": "This ad leverages the charm and curiosity associated with raccoons to create a memorable and light-hearted connection to EMS technology, appealing to the target audience\'s sense of fun and creativity.",\n      "text": "Step into the world of EMS magic at our Long Island City gym! Let the raccoon squad guide you on a journey to fitness success with high-intensity workouts and innovative training techniques. Join the fun today!",\n      "campaignName":"RaccoonFit Adventures",\n      "campaignObjective":"engagement",\n      "adsetName":"Raccoon Revolution",\n      "adName":"Magic Typing"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Uncover the secret to fitness with the raccoon crew!",\n      "imageDescription": "The video ad features raccoons typing on a computer interspersed with clips of individuals engaged in EMS training. The text \'EMS Discovery\' is highlighted throughout the video, creating a playful and intriguing visual narrative that emphasizes the innovative nature of EMS workouts.",\n      "adOrientation": "Playful and intriguing theme",\n      "rationale": "This video ad combines the antics of raccoons with the intensity of EMS training to create an engaging and memorable storyline, drawing viewers into the world of fitness exploration and excitement.",\n      "text": "Embark on a fitness journey like no other with the raccoon crew at our Long Island City gym! Discover the secret to successful workouts with EMS technology and experience the joy of transformative fitness. Join the adventure today!",\n      "campaignName":"RaccoonFitness Quest",\n      "campaignObjective":"engagement",\n      "adsetName":"Discovery Crew",\n      "adName":"Fit Explorers"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads featuring raccoons typing on a computer to symbolize the innovative and fun nature of EMS training for women in the 25-50 age group."\n}',
          companyName: "Amplified EMS Gym",
          messageId: "66289b62a367b6943de7ab8f",
          disclaimer:
            "Results may vary. Consult with a fitness professional before starting any new exercise program.",
          summary:
            "The EMS gym in Long Island City is considering an ad featuring raccoons typing on a computer to symbolize the innovative and engaging nature of EMS training. The ad aims to appeal to women in the 25-50 age group by showcasing the unconventional and fun aspects of EMS workouts in a visually interesting manner.",
          createdAt: "2024-04-24T05:41:07.301Z",
          updatedAt: "2024-04-24T05:41:07.301Z",
          variants: [
            {
              id: "66289b747171bbf59869a697",
              variantNo: "1",
              adType: "Digital Banner Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66289b747171bbf59869a697_1713937382067.png",
              oneLiner: "Join the raccoon squad for EMS success!",
              imageDescription:
                "The ad portrays raccoons typing on a computer with the text 'EMS Magic' displayed above them. It presents a whimsical and humorous scene that symbolizes the innovative approach of EMS training, capturing attention in a unique and entertaining way.",
              adOrientation: "Whimsical and engaging theme",
              text: "Step into the world of EMS magic at our Long Island City gym! Let the raccoon squad guide you on a journey to fitness success with high-intensity workouts and innovative training techniques. Join the fun today!",
              rationale:
                "This ad leverages the charm and curiosity associated with raccoons to create a memorable and light-hearted connection to EMS technology, appealing to the target audience's sense of fun and creativity.",
              adCreativeId: "66289b737171bbf59869a696",
              createdAt: "2024-04-24T05:41:07.301Z",
              updatedAt: "2024-04-24T05:41:07.301Z",
              adId: null,
              images: [],
            },
            {
              id: "66289b747171bbf59869a698",
              variantNo: "2",
              adType: "Social Media Video Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66289b747171bbf59869a698_1713937382567.png",
              oneLiner: "Uncover the secret to fitness with the raccoon crew!",
              imageDescription:
                "The video ad features raccoons typing on a computer interspersed with clips of individuals engaged in EMS training. The text 'EMS Discovery' is highlighted throughout the video, creating a playful and intriguing visual narrative that emphasizes the innovative nature of EMS workouts.",
              adOrientation: "Playful and intriguing theme",
              text: "Embark on a fitness journey like no other with the raccoon crew at our Long Island City gym! Discover the secret to successful workouts with EMS technology and experience the joy of transformative fitness. Join the adventure today!",
              rationale:
                "This video ad combines the antics of raccoons with the intensity of EMS training to create an engaging and memorable storyline, drawing viewers into the world of fitness exploration and excitement.",
              adCreativeId: "66289b737171bbf59869a696",
              createdAt: "2024-04-24T05:41:07.301Z",
              updatedAt: "2024-04-24T05:41:07.301Z",
              adId: null,
              images: [],
            },
          ],
        },
      ],
    },
    {
      id: "66289b62a367b6943de7ab8e",
      content: "Make it racoons typing on a computer.",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-24T05:41:05.639Z",
      updatedAt: "2024-04-24T05:41:05.639Z",
      adCreatives: [],
    },
    {
      id: "6628837597ff579e240d6fd3",
      content:
        '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Power up your workout with EMS intensity!",\n      "imageDescription": "The ad depicts diverse individuals actively participating in EMS training sessions with the text \'EMS Intensity\' prominently displayed at the top. It showcases their dedication and focus in a modern and dynamic setting, with a style that is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",\n      "adOrientation": "Energetic and empowering theme",\n      "rationale": "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience\'s aspirations for fitness progress and transformation.",\n      "text": "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",\n      "campaignName":"EnergyBoost Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Intensity Pro",\n      "adName":"Power Moves"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Transform your body with EMS innovation!",\n      "imageDescription": "The video ad showcases individuals in action during EMS training sessions with the text \'EMS Innovation\' displayed prominently at the top. It highlights the intensity and focus of their workouts in a dynamic and motivational style, illustrating the potential for transformation through EMS fitness.",\n      "adOrientation": "Dynamic and motivational theme",\n      "rationale": "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",\n      "text": "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",\n      "campaignName":"Transformation Effect",\n      "campaignObjective":"engagement",\n      "adsetName":"Body Transformation",\n      "adName":"Innovation Fit"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym."\n}',
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-24T03:58:59.835Z",
      updatedAt: "2024-04-24T03:58:59.835Z",
      adCreatives: [
        {
          id: "662883847171bbf59869a692",
          conversationId: "6610e227211119401c79b489",
          adObjective:
            "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym.",
          json: '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Power up your workout with EMS intensity!",\n      "imageDescription": "The ad depicts diverse individuals actively participating in EMS training sessions with the text \'EMS Intensity\' prominently displayed at the top. It showcases their dedication and focus in a modern and dynamic setting, with a style that is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",\n      "adOrientation": "Energetic and empowering theme",\n      "rationale": "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience\'s aspirations for fitness progress and transformation.",\n      "text": "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",\n      "campaignName":"EnergyBoost Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Intensity Pro",\n      "adName":"Power Moves"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Transform your body with EMS innovation!",\n      "imageDescription": "The video ad showcases individuals in action during EMS training sessions with the text \'EMS Innovation\' displayed prominently at the top. It highlights the intensity and focus of their workouts in a dynamic and motivational style, illustrating the potential for transformation through EMS fitness.",\n      "adOrientation": "Dynamic and motivational theme",\n      "rationale": "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",\n      "text": "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",\n      "campaignName":"Transformation Effect",\n      "campaignObjective":"engagement",\n      "adsetName":"Body Transformation",\n      "adName":"Innovation Fit"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym."\n}',
          companyName: "Amplified EMS Gym",
          messageId: "6628837597ff579e240d6fd3",
          disclaimer:
            "Results may vary. Consult with a fitness professional before starting any new exercise program.",
          summary:
            "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",
          createdAt: "2024-04-24T03:58:59.835Z",
          updatedAt: "2024-04-24T03:58:59.835Z",
          variants: [
            {
              id: "662883847171bbf59869a694",
              variantNo: "2",
              adType: "Social Media Video Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/662883847171bbf59869a694_1713931177251.png",
              oneLiner: "Transform your body with EMS innovation!",
              imageDescription:
                "The video ad showcases individuals in action during EMS training sessions with the text 'EMS Innovation' displayed prominently at the top. It highlights the intensity and focus of their workouts in a dynamic and motivational style, illustrating the potential for transformation through EMS fitness.",
              adOrientation: "Dynamic and motivational theme",
              text: "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",
              rationale:
                "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",
              adCreativeId: "662883847171bbf59869a692",
              createdAt: "2024-04-24T03:58:59.835Z",
              updatedAt: "2024-04-24T03:58:59.835Z",
              adId: null,
              images: [],
            },
            {
              id: "662883847171bbf59869a693",
              variantNo: "1",
              adType: "Digital Banner Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/662883847171bbf59869a693_1713931176793.png",
              oneLiner: "Power up your workout with EMS intensity!",
              imageDescription:
                "The ad depicts diverse individuals actively participating in EMS training sessions with the text 'EMS Intensity' prominently displayed at the top. It showcases their dedication and focus in a modern and dynamic setting, with a style that is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",
              adOrientation: "Energetic and empowering theme",
              text: "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",
              rationale:
                "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience's aspirations for fitness progress and transformation.",
              adCreativeId: "662883847171bbf59869a692",
              createdAt: "2024-04-24T03:58:59.835Z",
              updatedAt: "2024-04-24T03:58:59.835Z",
              adId: null,
              images: [],
            },
          ],
        },
      ],
    },
    {
      id: "6628837597ff579e240d6fd2",
      content: "Add ems text on top of ads",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-24T03:58:58.074Z",
      updatedAt: "2024-04-24T03:58:58.074Z",
      adCreatives: [],
    },
    {
      id: "6627a98369829e42e4cf5e9b",
      content:
        '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Power up your workout with EMS intensity!",\n      "imageDescription": "The ad portrays diverse individuals actively participating in EMS training sessions, showcasing their dedication and focus in a modern and dynamic setting. The style is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",\n      "adOrientation": "Energetic and empowering theme",\n      "rationale": "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience\'s aspirations for fitness progress and transformation.",\n      "text": "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",\n      "campaignName":"EnergyBoost Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Intensity Pro",\n      "adName":"Power Moves"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Transform your body with EMS innovation!",\n      "imageDescription": "The video ad showcases individuals in action during EMS training sessions, highlighting the intensity and focus of their workouts. The style is dynamic and motivational, illustrating the potential for transformation through EMS fitness.",\n      "adOrientation": "Dynamic and motivational theme",\n      "rationale": "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",\n      "text": "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",\n      "campaignName":"Transformation Effect",\n      "campaignObjective":"engagement",\n      "adsetName":"Body Transformation",\n      "adName":"Innovation Fit"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym."\n}',
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-23T12:29:10.308Z",
      updatedAt: "2024-04-23T12:29:10.308Z",
      adCreatives: [
        {
          id: "6627a9967171bbf59869a68e",
          conversationId: "6610e227211119401c79b489",
          adObjective:
            "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym.",
          json: '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Power up your workout with EMS intensity!",\n      "imageDescription": "The ad portrays diverse individuals actively participating in EMS training sessions, showcasing their dedication and focus in a modern and dynamic setting. The style is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",\n      "adOrientation": "Energetic and empowering theme",\n      "rationale": "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience\'s aspirations for fitness progress and transformation.",\n      "text": "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",\n      "campaignName":"EnergyBoost Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Intensity Pro",\n      "adName":"Power Moves"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Transform your body with EMS innovation!",\n      "imageDescription": "The video ad showcases individuals in action during EMS training sessions, highlighting the intensity and focus of their workouts. The style is dynamic and motivational, illustrating the potential for transformation through EMS fitness.",\n      "adOrientation": "Dynamic and motivational theme",\n      "rationale": "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",\n      "text": "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",\n      "campaignName":"Transformation Effect",\n      "campaignObjective":"engagement",\n      "adsetName":"Body Transformation",\n      "adName":"Innovation Fit"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym."\n}',
          companyName: "Amplified EMS Gym",
          messageId: "6627a98369829e42e4cf5e9b",
          disclaimer:
            "Results may vary. Consult with a fitness professional before starting any new exercise program.",
          summary:
            "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",
          createdAt: "2024-04-23T12:29:10.308Z",
          updatedAt: "2024-04-23T12:29:10.308Z",
          variants: [
            {
              id: "6627a9977171bbf59869a690",
              variantNo: "2",
              adType: "Social Media Video Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/6627a9977171bbf59869a690_1713875429040.png",
              oneLiner: "Transform your body with EMS innovation!",
              imageDescription:
                "The video ad showcases individuals in action during EMS training sessions, highlighting the intensity and focus of their workouts. The style is dynamic and motivational, illustrating the potential for transformation through EMS fitness.",
              adOrientation: "Dynamic and motivational theme",
              text: "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",
              rationale:
                "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",
              adCreativeId: "6627a9967171bbf59869a68e",
              createdAt: "2024-04-23T12:29:10.308Z",
              updatedAt: "2024-04-23T12:29:10.308Z",
              adId: null,
              images: [],
            },
            {
              id: "6627a9977171bbf59869a68f",
              variantNo: "1",
              adType: "Digital Banner Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/6627a9977171bbf59869a68f_1713875422996.png",
              oneLiner: "Power up your workout with EMS intensity!",
              imageDescription:
                "The ad portrays diverse individuals actively participating in EMS training sessions, showcasing their dedication and focus in a modern and dynamic setting. The style is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",
              adOrientation: "Energetic and empowering theme",
              text: "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",
              rationale:
                "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience's aspirations for fitness progress and transformation.",
              adCreativeId: "6627a9967171bbf59869a68e",
              createdAt: "2024-04-23T12:29:10.308Z",
              updatedAt: "2024-04-23T12:29:10.308Z",
              adId: null,
              images: [],
            },
          ],
        },
      ],
    },
    {
      id: "6627a98369829e42e4cf5e9a",
      content: "Make ad doing ems",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-23T12:29:08.636Z",
      updatedAt: "2024-04-23T12:29:08.636Z",
      adCreatives: [],
    },
    {
      id: "6627a78b5806ed7b85648068",
      content:
        '{\n  "summary": "The EMS gym in Long Island City is exploring the idea of creating an ad featuring dogs using EMS technology to showcase the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to highlight the fun and innovative aspects of EMS training in a playful and engaging manner.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Paw-fect fitness with EMS - dogs\' choice!",\n      "imageDescription": "The ad presents animated dogs in workout gear participating in EMS exercises with enthusiasm and energy in a cheerful and vibrant setting. The style is playful and colorful, invoking a sense of joy and activity in the viewer.",\n      "adOrientation": "Playful and vibrant theme",\n      "rationale": "This ad leverages the universal appeal of dogs to create a heartwarming and entertaining connection to the exciting EMS technology, appealing to the target audience\'s love for animals and fitness.",\n      "text": "Unleash the power of EMS training at our Long Island City gym - approved by our furry friends! Experience a workout that leaves tails wagging and spirits high. Join the canine crew for a paw-some fitness journey today!",\n      "campaignName":"DogFit",\n      "campaignObjective":"engagement",\n      "adsetName":"Canine Workout",\n      "adName":"Paw & Pulse"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Fetch your fitness goals with dog-approved EMS!",\n      "imageDescription": "The video ad showcases dogs of various breeds engaging in EMS training activities, interspersed with clips of women in the gym performing similar exercises. The style is dynamic and heartwarming, emphasizing the connection between canine agility and human fitness commitment.",\n      "adOrientation": "Dynamic and heartwarming theme",\n      "rationale": "This video ad creates an engaging and relatable narrative by showcasing dogs\' energy and enthusiasm alongside women\'s fitness efforts, highlighting the joy and effectiveness of EMS workouts for women.",\n      "text": "Chase away the boredom in your workout routine and embrace the doggo way with EMS fitness at our Long Island City gym! Let our furry friends motivate you to jump, run, and tone your way to a healthier you. Join the canine workout revolution today!",\n      "campaignName":"DoggoFit Journey",\n      "campaignObjective":"engagement",\n      "adsetName":"Doggy Fitness Boost",\n      "adName":"Fit & Furry"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create an engaging and playful ad featuring dogs using EMS technology to attract women in the 25-50 age group to the gym."\n}',
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-23T12:20:45.851Z",
      updatedAt: "2024-04-23T12:20:45.851Z",
      adCreatives: [
        {
          id: "6627a79e7171bbf59869a68a",
          conversationId: "6610e227211119401c79b489",
          adObjective:
            "To create an engaging and playful ad featuring dogs using EMS technology to attract women in the 25-50 age group to the gym.",
          json: '{\n  "summary": "The EMS gym in Long Island City is exploring the idea of creating an ad featuring dogs using EMS technology to showcase the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to highlight the fun and innovative aspects of EMS training in a playful and engaging manner.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Paw-fect fitness with EMS - dogs\' choice!",\n      "imageDescription": "The ad presents animated dogs in workout gear participating in EMS exercises with enthusiasm and energy in a cheerful and vibrant setting. The style is playful and colorful, invoking a sense of joy and activity in the viewer.",\n      "adOrientation": "Playful and vibrant theme",\n      "rationale": "This ad leverages the universal appeal of dogs to create a heartwarming and entertaining connection to the exciting EMS technology, appealing to the target audience\'s love for animals and fitness.",\n      "text": "Unleash the power of EMS training at our Long Island City gym - approved by our furry friends! Experience a workout that leaves tails wagging and spirits high. Join the canine crew for a paw-some fitness journey today!",\n      "campaignName":"DogFit",\n      "campaignObjective":"engagement",\n      "adsetName":"Canine Workout",\n      "adName":"Paw & Pulse"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Fetch your fitness goals with dog-approved EMS!",\n      "imageDescription": "The video ad showcases dogs of various breeds engaging in EMS training activities, interspersed with clips of women in the gym performing similar exercises. The style is dynamic and heartwarming, emphasizing the connection between canine agility and human fitness commitment.",\n      "adOrientation": "Dynamic and heartwarming theme",\n      "rationale": "This video ad creates an engaging and relatable narrative by showcasing dogs\' energy and enthusiasm alongside women\'s fitness efforts, highlighting the joy and effectiveness of EMS workouts for women.",\n      "text": "Chase away the boredom in your workout routine and embrace the doggo way with EMS fitness at our Long Island City gym! Let our furry friends motivate you to jump, run, and tone your way to a healthier you. Join the canine workout revolution today!",\n      "campaignName":"DoggoFit Journey",\n      "campaignObjective":"engagement",\n      "adsetName":"Doggy Fitness Boost",\n      "adName":"Fit & Furry"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create an engaging and playful ad featuring dogs using EMS technology to attract women in the 25-50 age group to the gym."\n}',
          companyName: "Amplified EMS Gym",
          messageId: "6627a78b5806ed7b85648068",
          disclaimer:
            "Results may vary. Consult with a fitness professional before starting any new exercise program.",
          summary:
            "The EMS gym in Long Island City is exploring the idea of creating an ad featuring dogs using EMS technology to showcase the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to highlight the fun and innovative aspects of EMS training in a playful and engaging manner.",
          createdAt: "2024-04-23T12:20:45.851Z",
          updatedAt: "2024-04-23T12:20:45.851Z",
          variants: [
            {
              id: "6627a79e7171bbf59869a68b",
              variantNo: "1",
              adType: "Digital Banner Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/6627a79e7171bbf59869a68b_1713874935397.png",
              oneLiner: "Paw-fect fitness with EMS - dogs' choice!",
              imageDescription:
                "The ad presents animated dogs in workout gear participating in EMS exercises with enthusiasm and energy in a cheerful and vibrant setting. The style is playful and colorful, invoking a sense of joy and activity in the viewer.",
              adOrientation: "Playful and vibrant theme",
              text: "Unleash the power of EMS training at our Long Island City gym - approved by our furry friends! Experience a workout that leaves tails wagging and spirits high. Join the canine crew for a paw-some fitness journey today!",
              rationale:
                "This ad leverages the universal appeal of dogs to create a heartwarming and entertaining connection to the exciting EMS technology, appealing to the target audience's love for animals and fitness.",
              adCreativeId: "6627a79e7171bbf59869a68a",
              createdAt: "2024-04-23T12:20:45.851Z",
              updatedAt: "2024-04-23T12:20:45.851Z",
              adId: null,
              images: [],
            },
            {
              id: "6627a79e7171bbf59869a68c",
              variantNo: "2",
              adType: "Social Media Video Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/6627a79e7171bbf59869a68c_1713874934928.png",
              oneLiner: "Fetch your fitness goals with dog-approved EMS!",
              imageDescription:
                "The video ad showcases dogs of various breeds engaging in EMS training activities, interspersed with clips of women in the gym performing similar exercises. The style is dynamic and heartwarming, emphasizing the connection between canine agility and human fitness commitment.",
              adOrientation: "Dynamic and heartwarming theme",
              text: "Chase away the boredom in your workout routine and embrace the doggo way with EMS fitness at our Long Island City gym! Let our furry friends motivate you to jump, run, and tone your way to a healthier you. Join the canine workout revolution today!",
              rationale:
                "This video ad creates an engaging and relatable narrative by showcasing dogs' energy and enthusiasm alongside women's fitness efforts, highlighting the joy and effectiveness of EMS workouts for women.",
              adCreativeId: "6627a79e7171bbf59869a68a",
              createdAt: "2024-04-23T12:20:45.851Z",
              updatedAt: "2024-04-23T12:20:45.851Z",
              adId: null,
              images: [],
            },
          ],
        },
      ],
    },
    {
      id: "6627a78b5806ed7b85648067",
      content: "Make it dogs doing ems",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-23T12:20:44.217Z",
      updatedAt: "2024-04-23T12:20:44.217Z",
      adCreatives: [],
    },
    {
      id: "662515241f37e96ae8c7b00e",
      content:
        '{\n  "summary": "The EMS gym in Long Island City is looking to create an engaging ad featuring rabbits using EMS technology to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and innovation of EMS training in a fun and unconventional way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Hop into fitness with EMS - bunnies\' choice!",\n      "imageDescription": "The ad features adorable animated rabbits wearing EMS training gear, engaging in workout activities in a whimsical and energetic setting. The style is playful and colorful, sparking curiosity and interest in EMS fitness.",\n      "adOrientation": "Whimsical and energetic theme",\n      "rationale": "This ad leverages the charm of rabbits to capture attention and create a memorable connection to the innovative EMS technology, appealing to the target audience\'s sense of fun and adventure.",\n      "text": "Join the fun with EMS training at our gym in Long Island City! Experience a workout like never before, endorsed by the bunnies themselves. Discover the joy of effective and efficient fitness today!",\n      "campaignName":"BunnyFit",\n      "campaignObjective":"engagement",\n      "adsetName":"Rabbit Workout",\n      "adName":"Hop & Tone"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Energize your workout with rabbit-approved EMS!",\n      "imageDescription": "The video ad showcases rabbits in different EMS training scenarios, interspersed with clips of women in the gym undergoing similar exercises. The style is dynamic and upbeat, highlighting the connection between animal agility and human fitness.",\n      "adOrientation": "Dynamic and engaging theme",\n      "rationale": "This video ad creates a visually compelling narrative by juxtaposing rabbits\' natural agility with women\'s fitness journey, emphasizing the effectiveness and excitement of EMS workouts for women.",\n      "text": "Revamp your workout routine and unleash your inner bunny with EMS fitness at our Long Island City gym! Let the bunnies inspire you to hop, jump, and tone your way to a fitter you. Join the rabbit revolution today!",\n      "campaignName":"RabbitRush Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Bunny Boost",\n      "adName":"Fit & Fuzzy"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create a memorable and engaging ad featuring rabbits using EMS technology to attract women in the 25-50 age group to the gym."\n}',
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-21T13:31:31.302Z",
      updatedAt: "2024-04-21T13:31:31.302Z",
      adCreatives: [
        {
          id: "662515336ee95fa4052c2c75",
          conversationId: "6610e227211119401c79b489",
          adObjective:
            "To create a memorable and engaging ad featuring rabbits using EMS technology to attract women in the 25-50 age group to the gym.",
          json: '{\n  "summary": "The EMS gym in Long Island City is looking to create an engaging ad featuring rabbits using EMS technology to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and innovation of EMS training in a fun and unconventional way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Hop into fitness with EMS - bunnies\' choice!",\n      "imageDescription": "The ad features adorable animated rabbits wearing EMS training gear, engaging in workout activities in a whimsical and energetic setting. The style is playful and colorful, sparking curiosity and interest in EMS fitness.",\n      "adOrientation": "Whimsical and energetic theme",\n      "rationale": "This ad leverages the charm of rabbits to capture attention and create a memorable connection to the innovative EMS technology, appealing to the target audience\'s sense of fun and adventure.",\n      "text": "Join the fun with EMS training at our gym in Long Island City! Experience a workout like never before, endorsed by the bunnies themselves. Discover the joy of effective and efficient fitness today!",\n      "campaignName":"BunnyFit",\n      "campaignObjective":"engagement",\n      "adsetName":"Rabbit Workout",\n      "adName":"Hop & Tone"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Energize your workout with rabbit-approved EMS!",\n      "imageDescription": "The video ad showcases rabbits in different EMS training scenarios, interspersed with clips of women in the gym undergoing similar exercises. The style is dynamic and upbeat, highlighting the connection between animal agility and human fitness.",\n      "adOrientation": "Dynamic and engaging theme",\n      "rationale": "This video ad creates a visually compelling narrative by juxtaposing rabbits\' natural agility with women\'s fitness journey, emphasizing the effectiveness and excitement of EMS workouts for women.",\n      "text": "Revamp your workout routine and unleash your inner bunny with EMS fitness at our Long Island City gym! Let the bunnies inspire you to hop, jump, and tone your way to a fitter you. Join the rabbit revolution today!",\n      "campaignName":"RabbitRush Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Bunny Boost",\n      "adName":"Fit & Fuzzy"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create a memorable and engaging ad featuring rabbits using EMS technology to attract women in the 25-50 age group to the gym."\n}',
          companyName: "Amplified EMS Gym",
          messageId: "662515241f37e96ae8c7b00e",
          disclaimer:
            "Results may vary. Consult with a fitness professional before starting any new exercise program.",
          summary:
            "The EMS gym in Long Island City is looking to create an engaging ad featuring rabbits using EMS technology to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and innovation of EMS training in a fun and unconventional way.",
          createdAt: "2024-04-21T13:31:31.302Z",
          updatedAt: "2024-04-21T13:31:31.302Z",
          variants: [
            {
              id: "662515346ee95fa4052c2c76",
              variantNo: "1",
              adType: "Digital Banner Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/662515346ee95fa4052c2c76_1713706336624.png",
              oneLiner: "Hop into fitness with EMS - bunnies' choice!",
              imageDescription:
                "The ad features adorable animated rabbits wearing EMS training gear, engaging in workout activities in a whimsical and energetic setting. The style is playful and colorful, sparking curiosity and interest in EMS fitness.",
              adOrientation: "Whimsical and energetic theme",
              text: "Join the fun with EMS training at our gym in Long Island City! Experience a workout like never before, endorsed by the bunnies themselves. Discover the joy of effective and efficient fitness today!",
              rationale:
                "This ad leverages the charm of rabbits to capture attention and create a memorable connection to the innovative EMS technology, appealing to the target audience's sense of fun and adventure.",
              adCreativeId: "662515336ee95fa4052c2c75",
              createdAt: "2024-04-21T13:31:31.302Z",
              updatedAt: "2024-04-21T13:31:31.302Z",
              adId: null,
              images: [],
            },
            {
              id: "662515346ee95fa4052c2c77",
              variantNo: "2",
              adType: "Social Media Video Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/662515346ee95fa4052c2c77_1713706345090.png",
              oneLiner: "Energize your workout with rabbit-approved EMS!",
              imageDescription:
                "The video ad showcases rabbits in different EMS training scenarios, interspersed with clips of women in the gym undergoing similar exercises. The style is dynamic and upbeat, highlighting the connection between animal agility and human fitness.",
              adOrientation: "Dynamic and engaging theme",
              text: "Revamp your workout routine and unleash your inner bunny with EMS fitness at our Long Island City gym! Let the bunnies inspire you to hop, jump, and tone your way to a fitter you. Join the rabbit revolution today!",
              rationale:
                "This video ad creates a visually compelling narrative by juxtaposing rabbits' natural agility with women's fitness journey, emphasizing the effectiveness and excitement of EMS workouts for women.",
              adCreativeId: "662515336ee95fa4052c2c75",
              createdAt: "2024-04-21T13:31:31.302Z",
              updatedAt: "2024-04-21T13:31:31.302Z",
              adId: null,
              images: [],
            },
          ],
        },
      ],
    },
    {
      id: "662515241f37e96ae8c7b00d",
      content: "Hey can you create an ad with rabbits using EMS technology",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-21T13:31:29.740Z",
      updatedAt: "2024-04-21T13:31:29.740Z",
      adCreatives: [],
    },
    {
      id: "66230b9a575b3e513bf4ea84",
      content:
        '{\n  "summary": "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women\'s fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",\n  "variants": [\n    {\n      "confidence": "90%",\n      "adType": "Facebook Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Feel the burn, see the results!",\n      "imageDescription": "The ad features women from diverse backgrounds engaged in group EMS fitness sessions with smiles and determination. The style is authentic and motivating, capturing the camaraderie and energy of the workout.",\n      "adOrientation": "Inclusive and empowering theme",\n      "rationale": "This ad showcases the community aspect of EMS training, highlighting the support and encouragement that women can experience while achieving their fitness goals.",\n      "text": "Join our empowering fitness community at the next-gen EMS gym in Long Island City! Personalized programs, inclusive environment, and effective workouts for women of all ages. Start your journey now!",\n      "campaignName":"EmpowerHer Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Community Fit",\n      "adName":"Burn & Glow"\n    },\n    {\n      "confidence": "85%",\n      "adType": "Instagram Ad",\n      "variantNo": "2",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Strength, grace, amplified results!",\n      "imageDescription": "The ad showcases a woman in a graceful yoga pose juxtaposed with a dynamic EMS workout session. The style is elegant yet powerful, symbolizing the balance between strength and flexibility.",\n      "adOrientation": "Elegance and power theme",\n      "rationale": "This ad appeals to women\'s desire for a balanced fitness approach, combining strength training with gracefulness and emphasizing the amplified results of EMS fitness.",\n      "text": "Experience the beauty of strength with EMS training at our Long Island City gym! Balance, power, and transformation await you in a welcoming and supportive environment. Discover your potential today!",\n      "campaignName":"Graceful Strength Fitness",\n      "campaignObjective":"app_promotion",\n      "adsetName":"Strength & Serenity",\n      "adName":"Graceful Amplify"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group."\n}',
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-20T00:26:16.055Z",
      updatedAt: "2024-04-20T00:26:16.055Z",
      adCreatives: [
        {
          id: "66230ba8d94c2c7088394b08",
          conversationId: "6610e227211119401c79b489",
          adObjective:
            "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group.",
          json: '{\n  "summary": "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women\'s fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",\n  "variants": [\n    {\n      "confidence": "90%",\n      "adType": "Facebook Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Feel the burn, see the results!",\n      "imageDescription": "The ad features women from diverse backgrounds engaged in group EMS fitness sessions with smiles and determination. The style is authentic and motivating, capturing the camaraderie and energy of the workout.",\n      "adOrientation": "Inclusive and empowering theme",\n      "rationale": "This ad showcases the community aspect of EMS training, highlighting the support and encouragement that women can experience while achieving their fitness goals.",\n      "text": "Join our empowering fitness community at the next-gen EMS gym in Long Island City! Personalized programs, inclusive environment, and effective workouts for women of all ages. Start your journey now!",\n      "campaignName":"EmpowerHer Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Community Fit",\n      "adName":"Burn & Glow"\n    },\n    {\n      "confidence": "85%",\n      "adType": "Instagram Ad",\n      "variantNo": "2",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Strength, grace, amplified results!",\n      "imageDescription": "The ad showcases a woman in a graceful yoga pose juxtaposed with a dynamic EMS workout session. The style is elegant yet powerful, symbolizing the balance between strength and flexibility.",\n      "adOrientation": "Elegance and power theme",\n      "rationale": "This ad appeals to women\'s desire for a balanced fitness approach, combining strength training with gracefulness and emphasizing the amplified results of EMS fitness.",\n      "text": "Experience the beauty of strength with EMS training at our Long Island City gym! Balance, power, and transformation await you in a welcoming and supportive environment. Discover your potential today!",\n      "campaignName":"Graceful Strength Fitness",\n      "campaignObjective":"app_promotion",\n      "adsetName":"Strength & Serenity",\n      "adName":"Graceful Amplify"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group."\n}',
          companyName: "Amplified EMS Gym",
          messageId: "66230b9a575b3e513bf4ea84",
          disclaimer:
            "Results may vary. Consult with a fitness professional before starting any new exercise program.",
          summary:
            "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women's fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",
          createdAt: "2024-04-20T00:26:16.055Z",
          updatedAt: "2024-04-20T00:26:16.055Z",
          variants: [
            {
              id: "66230ba9d94c2c7088394b0a",
              variantNo: "2",
              adType: "Instagram Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66230ba9d94c2c7088394b0a_1713572831042.png",
              oneLiner: "Strength, grace, amplified results!",
              imageDescription:
                "The ad showcases a woman in a graceful yoga pose juxtaposed with a dynamic EMS workout session. The style is elegant yet powerful, symbolizing the balance between strength and flexibility.",
              adOrientation: "Elegance and power theme",
              text: "Experience the beauty of strength with EMS training at our Long Island City gym! Balance, power, and transformation await you in a welcoming and supportive environment. Discover your potential today!",
              rationale:
                "This ad appeals to women's desire for a balanced fitness approach, combining strength training with gracefulness and emphasizing the amplified results of EMS fitness.",
              adCreativeId: "66230ba8d94c2c7088394b08",
              createdAt: "2024-04-20T00:26:16.055Z",
              updatedAt: "2024-04-20T00:26:16.055Z",
              adId: null,
              images: [],
            },
            {
              id: "66230ba8d94c2c7088394b09",
              variantNo: "1",
              adType: "Facebook Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66230ba8d94c2c7088394b09_1713572802222.png",
              oneLiner: "Feel the burn, see the results!",
              imageDescription:
                "The ad features women from diverse backgrounds engaged in group EMS fitness sessions with smiles and determination. The style is authentic and motivating, capturing the camaraderie and energy of the workout.",
              adOrientation: "Inclusive and empowering theme",
              text: "Join our empowering fitness community at the next-gen EMS gym in Long Island City! Personalized programs, inclusive environment, and effective workouts for women of all ages. Start your journey now!",
              rationale:
                "This ad showcases the community aspect of EMS training, highlighting the support and encouragement that women can experience while achieving their fitness goals.",
              adCreativeId: "66230ba8d94c2c7088394b08",
              createdAt: "2024-04-20T00:26:16.055Z",
              updatedAt: "2024-04-20T00:26:16.055Z",
              adId: null,
              images: [],
            },
          ],
        },
      ],
    },
    {
      id: "66230b9a575b3e513bf4ea83",
      content: "Make it more human like images",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-20T00:26:14.516Z",
      updatedAt: "2024-04-20T00:26:14.516Z",
      adCreatives: [],
    },
    {
      id: "66230a647e61aa6409257bed",
      content:
        '{\n  "summary": "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women\'s fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",\n  "variants": [\n    {\n      "confidence": "90%",\n      "adType": "Facebook Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Get toned in lightning speed!",\n      "imageDescription": "The ad features a diverse group of women of different ages and body types engaging in EMS fitness training. The style is modern and energetic, capturing the intensity of the workout.",\n      "adOrientation": "Bright and motivating theme",\n      "rationale": "This ad showcases the speed and effectiveness of EMS training in achieving toned muscles, aligning with the target audience\'s desire for quick results.",\n      "text": "Achieve your fitness goals faster with our next-gen EMS gym in Long Island City! Personalized training programs, tailored equipment, and supportive female community. Book your trial session now!",\n      "campaignName":"EmpowerHer Fitness",\n      "campaignObjective":"sales",\n      "adsetName":"Women Power Boost",\n      "adName":"Toned Lightning"\n    },\n    {\n      "confidence": "85%",\n      "adType": "Instagram Ad",\n      "variantNo": "2",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Fitness redefined, results amplified!",\n      "imageDescription": "The ad showcases before-and-after images of women who have experienced transformational results with EMS training. The style is impactful and inspiring, highlighting the visible changes in physique.",\n      "adOrientation": "Transformational success theme",\n      "rationale": "This ad emphasizes the transformative outcomes of EMS fitness, resonating with women\'s desire for body shaping and overall fitness improvement.",\n      "text": "Discover the power of EMS training at our Long Island City gym! Tailored programs for women in every stage, safe and efficient workouts, and a supportive environment. Claim your special offer today!",\n      "campaignName":"Amplify Her Fitness",\n      "campaignObjective":"leads",\n      "adsetName":"Total Body Transformation",\n      "adName":"Fitness Redefined"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group."\n}',
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-20T00:21:06.263Z",
      updatedAt: "2024-04-20T00:21:06.263Z",
      adCreatives: [
        {
          id: "66230a72d94c2c7088394b02",
          conversationId: "6610e227211119401c79b489",
          adObjective:
            "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group.",
          json: '{\n  "summary": "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women\'s fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",\n  "variants": [\n    {\n      "confidence": "90%",\n      "adType": "Facebook Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Get toned in lightning speed!",\n      "imageDescription": "The ad features a diverse group of women of different ages and body types engaging in EMS fitness training. The style is modern and energetic, capturing the intensity of the workout.",\n      "adOrientation": "Bright and motivating theme",\n      "rationale": "This ad showcases the speed and effectiveness of EMS training in achieving toned muscles, aligning with the target audience\'s desire for quick results.",\n      "text": "Achieve your fitness goals faster with our next-gen EMS gym in Long Island City! Personalized training programs, tailored equipment, and supportive female community. Book your trial session now!",\n      "campaignName":"EmpowerHer Fitness",\n      "campaignObjective":"sales",\n      "adsetName":"Women Power Boost",\n      "adName":"Toned Lightning"\n    },\n    {\n      "confidence": "85%",\n      "adType": "Instagram Ad",\n      "variantNo": "2",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Fitness redefined, results amplified!",\n      "imageDescription": "The ad showcases before-and-after images of women who have experienced transformational results with EMS training. The style is impactful and inspiring, highlighting the visible changes in physique.",\n      "adOrientation": "Transformational success theme",\n      "rationale": "This ad emphasizes the transformative outcomes of EMS fitness, resonating with women\'s desire for body shaping and overall fitness improvement.",\n      "text": "Discover the power of EMS training at our Long Island City gym! Tailored programs for women in every stage, safe and efficient workouts, and a supportive environment. Claim your special offer today!",\n      "campaignName":"Amplify Her Fitness",\n      "campaignObjective":"leads",\n      "adsetName":"Total Body Transformation",\n      "adName":"Fitness Redefined"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group."\n}',
          companyName: "Amplified EMS Gym",
          messageId: "66230a647e61aa6409257bed",
          disclaimer:
            "Results may vary. Consult with a fitness professional before starting any new exercise program.",
          summary:
            "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women's fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",
          createdAt: "2024-04-20T00:21:06.263Z",
          updatedAt: "2024-04-20T00:21:06.263Z",
          variants: [
            {
              id: "66230a73d94c2c7088394b03",
              variantNo: "1",
              adType: "Facebook Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66230a73d94c2c7088394b03_1713572578645.png",
              oneLiner: "Get toned in lightning speed!",
              imageDescription:
                "The ad features a diverse group of women of different ages and body types engaging in EMS fitness training. The style is modern and energetic, capturing the intensity of the workout.",
              adOrientation: "Bright and motivating theme",
              text: "Achieve your fitness goals faster with our next-gen EMS gym in Long Island City! Personalized training programs, tailored equipment, and supportive female community. Book your trial session now!",
              rationale:
                "This ad showcases the speed and effectiveness of EMS training in achieving toned muscles, aligning with the target audience's desire for quick results.",
              adCreativeId: "66230a72d94c2c7088394b02",
              createdAt: "2024-04-20T00:21:06.263Z",
              updatedAt: "2024-04-20T00:21:06.263Z",
              adId: null,
              images: [],
            },
            {
              id: "66230a73d94c2c7088394b04",
              variantNo: "2",
              adType: "Instagram Ad",
              confidence: null,
              image: null,
              imageUrl:
                "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66230a73d94c2c7088394b04_1713572587672.png",
              oneLiner: "Fitness redefined, results amplified!",
              imageDescription:
                "The ad showcases before-and-after images of women who have experienced transformational results with EMS training. The style is impactful and inspiring, highlighting the visible changes in physique.",
              adOrientation: "Transformational success theme",
              text: "Discover the power of EMS training at our Long Island City gym! Tailored programs for women in every stage, safe and efficient workouts, and a supportive environment. Claim your special offer today!",
              rationale:
                "This ad emphasizes the transformative outcomes of EMS fitness, resonating with women's desire for body shaping and overall fitness improvement.",
              adCreativeId: "66230a72d94c2c7088394b02",
              createdAt: "2024-04-20T00:21:06.263Z",
              updatedAt: "2024-04-20T00:21:06.263Z",
              adId: null,
              images: [],
            },
          ],
        },
      ],
    },
    {
      id: "66230a647e61aa6409257bec",
      content: "Great i want to create new messages",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-20T00:21:04.613Z",
      updatedAt: "2024-04-20T00:21:04.613Z",
      adCreatives: [],
    },
    {
      id: "6610e227211119401c79b48a",
      content:
        "I'm reaching out to discuss creating a promotional video for our upcoming fitness event. We want to capture the excitement and energy of the event while highlighting the activities and special guests. Let's make something that really gets people pumped up!",
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-06T05:48:23.267Z",
      updatedAt: "2024-04-06T05:48:23.267Z",
      adCreatives: [
        {
          id: "6610e227211119401c79b48b",
          conversationId: "6610e227211119401c79b489",
          adObjective: "AdCreative | 16th January, 2024",
          json: "{}",
          companyName: "Amplified EMS",
          messageId: "6610e227211119401c79b48a",
          disclaimer: "This advertisement is sponsored by Amplified EMS.",
          summary:
            "We created a captivating ad campaign that effectively promoted our product to the target audience.",
          createdAt: "2024-04-06T05:48:23.267Z",
          updatedAt: "2024-04-06T05:48:23.267Z",
          variants: [
            {
              id: "6610e227211119401c79b48c",
              variantNo: "120207183720600340",
              adType: "Facebook Ad",
              confidence: "100",
              image:
                "https://www.facebook.com/ads/image/?d=AQKsdkb81O_Y5cNqCi0tRJoIDMJZsr4_nd0XAc34IXEM8xci-BYcoYxR8inKT14jclmDEOwAUGX1agzE6FVXkm-YAIjOqXURmfBquDYikmOSXgvHoGNYh4PWHNi17zu6QhycylPcN7A7IKKmys2-br3O",
              imageUrl:
                "https://www.facebook.com/ads/image/?d=AQKsdkb81O_Y5cNqCi0tRJoIDMJZsr4_nd0XAc34IXEM8xci-BYcoYxR8inKT14jclmDEOwAUGX1agzE6FVXkm-YAIjOqXURmfBquDYikmOSXgvHoGNYh4PWHNi17zu6QhycylPcN7A7IKKmys2-br3O",
              oneLiner: "Claim Your FREE Week of PERSONAL TRAINING!",
              imageDescription: "Test Image Description",
              adOrientation: "No Orientation Provided",
              text: "⚡️ Transform in 20: Claim Your FREE WEEK TRIAL for EMS Now! ⚡️\n🌟 Maximize Fitness in Minimal Time! 🏋️‍♀️\n\nReady to revolutionize your fitness journey? Dive into the world of Electrical Muscle Stimulation (EMS) and discover a workout that's not just efficient, but extraordinarily effective. Get fit, fast, and have fun – all in just 20 minutes!\n\n✨ Quick, Powerful 20-Minute Sessions!\n🔥 Burn 8x More Calories Than Regular Workouts!\n🔋 Experience Enhanced Muscle Activation!\n💪 Ideal for Everyone, Regardless of Age or Fitness Level!\n\nTake the first step towards a fitter you with our no-obligation FREE TRIAL. Why wait hours in the gym when 20 minutes can bring you the results you desire?\n\n👉 Tap to start your fitness revolution with a FREE EMS Workout Trial! #20MinuteFitness #FreeTrialEMS #RapidResults",
              rationale: "No Rationale Provided",
              adCreativeId: "6610e227211119401c79b48b",
              createdAt: "2024-04-06T05:48:23.267Z",
              updatedAt: "2024-04-06T05:48:23.267Z",
              adId: "120207183720600340",
              images: [
                {
                  bgImage:
                    "https://www.facebook.com/ads/image/?d=AQKsdkb81O_Y5cNqCi0tRJoIDMJZsr4_nd0XAc34IXEM8xci-BYcoYxR8inKT14jclmDEOwAUGX1agzE6FVXkm-YAIjOqXURmfBquDYikmOSXgvHoGNYh4PWHNi17zu6QhycylPcN7A7IKKmys2-br3O",
                  canvasState: null,
                  url: "https://www.facebook.com/ads/image/?d=AQKsdkb81O_Y5cNqCi0tRJoIDMJZsr4_nd0XAc34IXEM8xci-BYcoYxR8inKT14jclmDEOwAUGX1agzE6FVXkm-YAIjOqXURmfBquDYikmOSXgvHoGNYh4PWHNi17zu6QhycylPcN7A7IKKmys2-br3O",
                  timestamp: "2024-04-21T14:23:22.526Z",
                },
              ],
            },
            {
              id: "6610e227211119401c79b48e",
              variantNo: "120207183720610340",
              adType: "Facebook Ad",
              confidence: "100",
              image:
                "https://www.facebook.com/ads/image/?d=AQLlIxWdAwuF-kbA9mYzH3BaUdP25g0kXiYua7a48nOHznC483iz7XC6bPsnCYP5W_cI0GMloOXq2Zi_Xzabwimo0N0UhpazuMXiy6eDVBnSzpiw0poijwFr6-TU7imj5nvr7SxZNhPf7SpRYlxUNYmm",
              imageUrl:
                "https://www.facebook.com/ads/image/?d=AQLlIxWdAwuF-kbA9mYzH3BaUdP25g0kXiYua7a48nOHznC483iz7XC6bPsnCYP5W_cI0GMloOXq2Zi_Xzabwimo0N0UhpazuMXiy6eDVBnSzpiw0poijwFr6-TU7imj5nvr7SxZNhPf7SpRYlxUNYmm",
              oneLiner: "Claim Your FREE Week of PERSONAL TRAINING!",
              imageDescription: "Test Image Description",
              adOrientation: "No Orientation Provided",
              text: "⚡️ Transform in 20: Claim Your FREE WEEK TRIAL for EMS Now! ⚡️\n🌟 Maximize Fitness in Minimal Time! 🏋️‍♀️\n\nReady to revolutionize your fitness journey? Dive into the world of Electrical Muscle Stimulation (EMS) and discover a workout that's not just efficient, but extraordinarily effective. Get fit, fast, and have fun – all in just 20 minutes!\n\n✨ Quick, Powerful 20-Minute Sessions!\n🔥 Burn 8x More Calories Than Regular Workouts!\n🔋 Experience Enhanced Muscle Activation!\n💪 Ideal for Everyone, Regardless of Age or Fitness Level!\n\nTake the first step towards a fitter you with our no-obligation FREE TRIAL. Why wait hours in the gym when 20 minutes can bring you the results you desire?\n\n👉 Tap to start your fitness revolution with a FREE EMS Workout Trial! #20MinuteFitness #FreeTrialEMS #RapidResults",
              rationale: "No Rationale Provided",
              adCreativeId: "6610e227211119401c79b48b",
              createdAt: "2024-04-06T05:48:23.267Z",
              updatedAt: "2024-04-06T05:48:23.267Z",
              adId: "120207183720610340",
              images: [],
            },
            {
              id: "6610e227211119401c79b48d",
              variantNo: "120207227499020340",
              adType: "Facebook Ad",
              confidence: "100",
              image:
                "https://www.facebook.com/ads/image/?d=AQKIgy_9pXg64LEqvpXQD7zh0SLDO-NZSdW9TpDqb95xANeYYbwIOy7_w258jiO8sn40xp_ox0E8mpjzhmX6qZs2BtzZL-5yjvUn-lL6STX3FfmC9BYKqq0JR6phQWiIwhfDDJ0rYQwsXYQeJ_bGnJ-t",
              imageUrl:
                "https://www.facebook.com/ads/image/?d=AQKIgy_9pXg64LEqvpXQD7zh0SLDO-NZSdW9TpDqb95xANeYYbwIOy7_w258jiO8sn40xp_ox0E8mpjzhmX6qZs2BtzZL-5yjvUn-lL6STX3FfmC9BYKqq0JR6phQWiIwhfDDJ0rYQwsXYQeJ_bGnJ-t",
              oneLiner: "Claim Your FREE Week of Personal Training!",
              imageDescription: "Test Image Description",
              adOrientation: "No Orientation Provided",
              text: "Kickstart your fitness journey with our exclusive FREE WEEK TRIAL with personal training! Embrace a healthier, stronger version of yourself this summer. 💪✨ \n\nClaim your complimentary week now and experience a new approach to fitness. Don't miss out – this offer expires soon! Your fitness goals await, start today! #SummerReady #FreeWeekTrial #FitnessGoals",
              rationale: "No Rationale Provided",
              adCreativeId: "6610e227211119401c79b48b",
              createdAt: "2024-04-06T05:48:23.267Z",
              updatedAt: "2024-04-06T05:48:23.267Z",
              adId: "120207227499020340",
              images: [],
            },
            {
              id: "6610e227211119401c79b48f",
              variantNo: "120207183720590340",
              adType: "Facebook Ad",
              confidence: "100",
              image:
                "https://www.facebook.com/ads/image/?d=AQKubXTt5kBP5q9qtSPApp0uATxfkF3jDO4_Pxf4EmMtNcg-CQtOapQNCBdAYwuwHqkcTd_E5Eg6c1iMTqA4gI6f48Tjj98iTdUHiImLSRfadjssyXsqiOEfCE7IhScNtIVsMNX__74saf8u5aRMjFVQ",
              imageUrl:
                "https://www.facebook.com/ads/image/?d=AQKubXTt5kBP5q9qtSPApp0uATxfkF3jDO4_Pxf4EmMtNcg-CQtOapQNCBdAYwuwHqkcTd_E5Eg6c1iMTqA4gI6f48Tjj98iTdUHiImLSRfadjssyXsqiOEfCE7IhScNtIVsMNX__74saf8u5aRMjFVQ",
              oneLiner: "Claim Your FREE Personal Training Week!",
              imageDescription: "Test Image Description",
              adOrientation: "No Orientation Provided",
              text: "Kickstart your fitness journey with our exclusive FREE WEEK trial of PERSONAL TRAINING! Embrace a healthier, stronger version of yourself. 💪✨ \n\nClaim your complimentary week now and experience a new approach to fitness. Don't miss out – this offer expires soon! Your fitness goals await, start today! #NewYearNewYou #FreeWeekTrial #FitnessGoals",
              rationale: "No Rationale Provided",
              adCreativeId: "6610e227211119401c79b48b",
              createdAt: "2024-04-06T05:48:23.267Z",
              updatedAt: "2024-04-06T05:48:23.267Z",
              adId: "120207183720590340",
              images: [],
            },
          ],
        },
      ],
    },
    {
      id: "6622792987902d17b0b0c36d",
      content:
        "Our EMS gym offers unique features and equipment specifically tailored to women in the 25-50 age group, including personalized training programs designed to address women's fitness goals at different life stages, such as pre and postnatal fitness, menopause-related fitness, and overall health and wellness.\n\nThe EMS workout intensity adapts to individual fitness levels among women through personalized training settings. Our trainers adjust the intensity of electrical impulses based on each woman's fitness level, ensuring a safe and effective workout for all participants.\n\nWe have special promotions and offers targeting women in the specified age range, such as discounted trial sessions, personalized training packages, and wellness workshops focusing on women's health and fitness concerns. These promotions can be highlighted in ads to attract more women to our gym.\n\nThe overall ambiance and atmosphere of our gym are designed to be welcoming, supportive, and empowering for women. We prioritize creating a comfortable and inclusive environment, with female-specific amenities, comfortable changing areas, and a supportive community of like-minded women.\n\nWe have partnerships and collaborations with nutritionists and wellness experts who add value to the fitness experience for women. Our clients have access to personalized nutrition plans, wellness workshops, and educational seminars, providing a holistic approach to health and fitness for women in the 25-50 age group.",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-06T05:44:23.603Z",
      updatedAt: "2024-04-06T05:44:23.603Z",
      adCreatives: [],
    },
    {
      id: "6622792987902d17b0b0c36c",
      content:
        "1. Can you specify any unique features or equipment your EMS gym offers to cater specifically to women in the 25-50 age group?\n2. How does the EMS workout intensity adapt to individual fitness levels among women?\n3. Are there any special promotions or offers targeting women in the specified age range that we should highlight in the ads?\n4. Could you provide details on the overall ambiance and atmosphere of your gym, particularly appealing to women?\n5. Do you have any partnerships or collaborations with nutritionists or wellness experts that add value to the fitness experience for women?\n\nWith this information, I have collected enough data to design the ad.",
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-06T05:43:23.603Z",
      updatedAt: "2024-04-06T05:43:23.603Z",
      adCreatives: [],
    },
    {
      id: "6622792987902d17b0b0c36b",
      content:
        "The specific fitness goals that our EMS gym aims to help women in the age group of 25-50 achieve include weight management, muscle strengthening, body shaping, and overall fitness improvement.\n\nEMS fitness offers high-intensity training stimulus by using electrical impulses to contract muscles, providing a more intense workout compared to traditional training methods. This helps in building muscle strength, improving endurance, and enhancing overall fitness levels.\n\nEMS fitness differentiates itself from traditional workout methods for women by providing a more time-efficient and effective workout, targeting a larger percentage of muscle fibers simultaneously, leading to faster and more visible results in a shorter period of time.\n\nBefore starting an EMS training session for women, our gym considers safety measures and contraindications such as pregnancy, epilepsy, pacemakers, and other medical conditions. We conduct thorough health assessments and provide personalized training programs to ensure the safety and well-being of our clients.\n\nWe have numerous success stories and testimonials from women in the target age group who have experienced positive results with EMS fitness. These include weight loss, muscle toning, increased strength, improved posture, and enhanced overall well-being. If you'd like to hear specific testimonials, please let me know!",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-06T05:42:23.603Z",
      updatedAt: "2024-04-06T05:42:23.603Z",
      adCreatives: [],
    },
    {
      id: "6622792987902d17b0b0c36a",
      content:
        "1. What specific fitness goals does your EMS gym aim to help women in the age group of 25-50 achieve?\n2. Can you provide more details on the high-intensity training stimulus that EMS fitness offers for women?\n3. How does EMS fitness differentiate itself from traditional workout methods for women?\n4. Could you elaborate on the safety measures and contraindications that your gym considers before starting an EMS training session for women?\n5. What success stories or testimonials do you have from women in the target age group who have experienced positive results with EMS fitness?\n\nPlease upload the specific images or visuals you want to incorporate into the ads.",
      role: "assistant",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-06T05:41:23.603Z",
      updatedAt: "2024-04-06T05:41:23.603Z",
      adCreatives: [],
    },
    {
      id: "6622792987902d17b0b0c369",
      content:
        "I want to create an AD for an EMS gym in long island city, its a next gen gym that allows you to loose 8 hrs of calories in 20 mins. Can you help me in creating the ads? \n\nPlease gather all the information of my business from my website. \nhttps://amplifiedems.com/\n\nI am looking to target Women as a specific Gender, and age group b/w 25 - 50",
      role: "user",
      conversationId: "6610e227211119401c79b489",
      createdAt: "2024-04-06T05:40:23.603Z",
      updatedAt: "2024-04-06T05:40:23.603Z",
      adCreatives: [],
    },
  ],
  conversation_type: "ad_creative",
  project_name: "ARTI AI - Direct Leads Campaign",
  lastAdCreativeCreatedAt: "2024-04-24T05:41:06.468Z",
  businessId: "66190e1ad833aab27ff79e05",
  userId: "66040baff5ac2361ea74a338",
  createdAt: "2024-04-06T05:48:23.267Z",
  updatedAt: "2024-04-24T05:41:06.468Z",
  adCreatives: [
    {
      id: "6610e227211119401c79b48b",
      conversationId: "6610e227211119401c79b489",
      adObjective: "AdCreative | 16th January, 2024",
      json: "{}",
      companyName: "Amplified EMS",
      messageId: "6610e227211119401c79b48a",
      disclaimer: "This advertisement is sponsored by Amplified EMS.",
      summary:
        "We created a captivating ad campaign that effectively promoted our product to the target audience.",
      createdAt: "2024-04-06T05:48:23.267Z",
      updatedAt: "2024-04-06T05:48:23.267Z",
      variants: [
        {
          id: "6610e227211119401c79b48c",
          variantNo: "120207183720600340",
          adType: "Facebook Ad",
          image:
            "https://www.facebook.com/ads/image/?d=AQKsdkb81O_Y5cNqCi0tRJoIDMJZsr4_nd0XAc34IXEM8xci-BYcoYxR8inKT14jclmDEOwAUGX1agzE6FVXkm-YAIjOqXURmfBquDYikmOSXgvHoGNYh4PWHNi17zu6QhycylPcN7A7IKKmys2-br3O",
          imageUrl:
            "https://www.facebook.com/ads/image/?d=AQKsdkb81O_Y5cNqCi0tRJoIDMJZsr4_nd0XAc34IXEM8xci-BYcoYxR8inKT14jclmDEOwAUGX1agzE6FVXkm-YAIjOqXURmfBquDYikmOSXgvHoGNYh4PWHNi17zu6QhycylPcN7A7IKKmys2-br3O",
          oneLiner: "Claim Your FREE Week of PERSONAL TRAINING!",
          text: "⚡️ Transform in 20: Claim Your FREE WEEK TRIAL for EMS Now! ⚡️\n🌟 Maximize Fitness in Minimal Time! 🏋️‍♀️\n\nReady to revolutionize your fitness journey? Dive into the world of Electrical Muscle Stimulation (EMS) and discover a workout that's not just efficient, but extraordinarily effective. Get fit, fast, and have fun – all in just 20 minutes!\n\n✨ Quick, Powerful 20-Minute Sessions!\n🔥 Burn 8x More Calories Than Regular Workouts!\n🔋 Experience Enhanced Muscle Activation!\n💪 Ideal for Everyone, Regardless of Age or Fitness Level!\n\nTake the first step towards a fitter you with our no-obligation FREE TRIAL. Why wait hours in the gym when 20 minutes can bring you the results you desire?\n\n👉 Tap to start your fitness revolution with a FREE EMS Workout Trial! #20MinuteFitness #FreeTrialEMS #RapidResults",
          posts: [],
          imageDescription: "Test Image Description",
          adOrientation: "No Orientation Provided",
          adCreativeId: "6610e227211119401c79b48b",
          rationale: "No Rationale Provided",
          createdAt: "2024-04-06T05:48:23.267Z",
          updatedAt: "2024-04-06T05:48:23.267Z",
        },
        {
          id: "6610e227211119401c79b48e",
          variantNo: "120207183720610340",
          adType: "Facebook Ad",
          image:
            "https://www.facebook.com/ads/image/?d=AQLlIxWdAwuF-kbA9mYzH3BaUdP25g0kXiYua7a48nOHznC483iz7XC6bPsnCYP5W_cI0GMloOXq2Zi_Xzabwimo0N0UhpazuMXiy6eDVBnSzpiw0poijwFr6-TU7imj5nvr7SxZNhPf7SpRYlxUNYmm",
          imageUrl:
            "https://www.facebook.com/ads/image/?d=AQLlIxWdAwuF-kbA9mYzH3BaUdP25g0kXiYua7a48nOHznC483iz7XC6bPsnCYP5W_cI0GMloOXq2Zi_Xzabwimo0N0UhpazuMXiy6eDVBnSzpiw0poijwFr6-TU7imj5nvr7SxZNhPf7SpRYlxUNYmm",
          oneLiner: "Claim Your FREE Week of PERSONAL TRAINING!",
          text: "⚡️ Transform in 20: Claim Your FREE WEEK TRIAL for EMS Now! ⚡️\n🌟 Maximize Fitness in Minimal Time! 🏋️‍♀️\n\nReady to revolutionize your fitness journey? Dive into the world of Electrical Muscle Stimulation (EMS) and discover a workout that's not just efficient, but extraordinarily effective. Get fit, fast, and have fun – all in just 20 minutes!\n\n✨ Quick, Powerful 20-Minute Sessions!\n🔥 Burn 8x More Calories Than Regular Workouts!\n🔋 Experience Enhanced Muscle Activation!\n💪 Ideal for Everyone, Regardless of Age or Fitness Level!\n\nTake the first step towards a fitter you with our no-obligation FREE TRIAL. Why wait hours in the gym when 20 minutes can bring you the results you desire?\n\n👉 Tap to start your fitness revolution with a FREE EMS Workout Trial! #20MinuteFitness #FreeTrialEMS #RapidResults",
          posts: [],
          imageDescription: "Test Image Description",
          adOrientation: "No Orientation Provided",
          adCreativeId: "6610e227211119401c79b48b",
          rationale: "No Rationale Provided",
          createdAt: "2024-04-06T05:48:23.267Z",
          updatedAt: "2024-04-06T05:48:23.267Z",
        },
        {
          id: "6610e227211119401c79b48d",
          variantNo: "120207227499020340",
          adType: "Facebook Ad",
          image:
            "https://www.facebook.com/ads/image/?d=AQKIgy_9pXg64LEqvpXQD7zh0SLDO-NZSdW9TpDqb95xANeYYbwIOy7_w258jiO8sn40xp_ox0E8mpjzhmX6qZs2BtzZL-5yjvUn-lL6STX3FfmC9BYKqq0JR6phQWiIwhfDDJ0rYQwsXYQeJ_bGnJ-t",
          imageUrl:
            "https://www.facebook.com/ads/image/?d=AQKIgy_9pXg64LEqvpXQD7zh0SLDO-NZSdW9TpDqb95xANeYYbwIOy7_w258jiO8sn40xp_ox0E8mpjzhmX6qZs2BtzZL-5yjvUn-lL6STX3FfmC9BYKqq0JR6phQWiIwhfDDJ0rYQwsXYQeJ_bGnJ-t",
          oneLiner: "Claim Your FREE Week of Personal Training!",
          text: "Kickstart your fitness journey with our exclusive FREE WEEK TRIAL with personal training! Embrace a healthier, stronger version of yourself this summer. 💪✨ \n\nClaim your complimentary week now and experience a new approach to fitness. Don't miss out – this offer expires soon! Your fitness goals await, start today! #SummerReady #FreeWeekTrial #FitnessGoals",
          posts: [],
          imageDescription: "Test Image Description",
          adOrientation: "No Orientation Provided",
          adCreativeId: "6610e227211119401c79b48b",
          rationale: "No Rationale Provided",
          createdAt: "2024-04-06T05:48:23.267Z",
          updatedAt: "2024-04-06T05:48:23.267Z",
        },
        {
          id: "6610e227211119401c79b48f",
          variantNo: "120207183720590340",
          adType: "Facebook Ad",
          image:
            "https://www.facebook.com/ads/image/?d=AQKubXTt5kBP5q9qtSPApp0uATxfkF3jDO4_Pxf4EmMtNcg-CQtOapQNCBdAYwuwHqkcTd_E5Eg6c1iMTqA4gI6f48Tjj98iTdUHiImLSRfadjssyXsqiOEfCE7IhScNtIVsMNX__74saf8u5aRMjFVQ",
          imageUrl:
            "https://www.facebook.com/ads/image/?d=AQKubXTt5kBP5q9qtSPApp0uATxfkF3jDO4_Pxf4EmMtNcg-CQtOapQNCBdAYwuwHqkcTd_E5Eg6c1iMTqA4gI6f48Tjj98iTdUHiImLSRfadjssyXsqiOEfCE7IhScNtIVsMNX__74saf8u5aRMjFVQ",
          oneLiner: "Claim Your FREE Personal Training Week!",
          text: "Kickstart your fitness journey with our exclusive FREE WEEK trial of PERSONAL TRAINING! Embrace a healthier, stronger version of yourself. 💪✨ \n\nClaim your complimentary week now and experience a new approach to fitness. Don't miss out – this offer expires soon! Your fitness goals await, start today! #NewYearNewYou #FreeWeekTrial #FitnessGoals",
          posts: [],
          imageDescription: "Test Image Description",
          adOrientation: "No Orientation Provided",
          adCreativeId: "6610e227211119401c79b48b",
          rationale: "No Rationale Provided",
          createdAt: "2024-04-06T05:48:23.267Z",
          updatedAt: "2024-04-06T05:48:23.267Z",
        },
      ],
    },
    {
      id: "66230a72d94c2c7088394b02",
      conversationId: "6610e227211119401c79b489",
      adObjective:
        "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group.",
      json: '{\n  "summary": "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women\'s fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",\n  "variants": [\n    {\n      "confidence": "90%",\n      "adType": "Facebook Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Get toned in lightning speed!",\n      "imageDescription": "The ad features a diverse group of women of different ages and body types engaging in EMS fitness training. The style is modern and energetic, capturing the intensity of the workout.",\n      "adOrientation": "Bright and motivating theme",\n      "rationale": "This ad showcases the speed and effectiveness of EMS training in achieving toned muscles, aligning with the target audience\'s desire for quick results.",\n      "text": "Achieve your fitness goals faster with our next-gen EMS gym in Long Island City! Personalized training programs, tailored equipment, and supportive female community. Book your trial session now!",\n      "campaignName":"EmpowerHer Fitness",\n      "campaignObjective":"sales",\n      "adsetName":"Women Power Boost",\n      "adName":"Toned Lightning"\n    },\n    {\n      "confidence": "85%",\n      "adType": "Instagram Ad",\n      "variantNo": "2",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Fitness redefined, results amplified!",\n      "imageDescription": "The ad showcases before-and-after images of women who have experienced transformational results with EMS training. The style is impactful and inspiring, highlighting the visible changes in physique.",\n      "adOrientation": "Transformational success theme",\n      "rationale": "This ad emphasizes the transformative outcomes of EMS fitness, resonating with women\'s desire for body shaping and overall fitness improvement.",\n      "text": "Discover the power of EMS training at our Long Island City gym! Tailored programs for women in every stage, safe and efficient workouts, and a supportive environment. Claim your special offer today!",\n      "campaignName":"Amplify Her Fitness",\n      "campaignObjective":"leads",\n      "adsetName":"Total Body Transformation",\n      "adName":"Fitness Redefined"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group."\n}',
      companyName: "Amplified EMS Gym",
      messageId: "66230a647e61aa6409257bed",
      disclaimer:
        "Results may vary. Consult with a fitness professional before starting any new exercise program.",
      summary:
        "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women's fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",
      createdAt: "2024-04-20T00:21:06.263Z",
      updatedAt: "2024-04-20T00:21:06.263Z",
      variants: [
        {
          id: "66230a73d94c2c7088394b03",
          variantNo: "1",
          adType: "Facebook Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66230a73d94c2c7088394b03_1713572578645.png",
          oneLiner: "Get toned in lightning speed!",
          text: "Achieve your fitness goals faster with our next-gen EMS gym in Long Island City! Personalized training programs, tailored equipment, and supportive female community. Book your trial session now!",
          posts: [],
          imageDescription:
            "The ad features a diverse group of women of different ages and body types engaging in EMS fitness training. The style is modern and energetic, capturing the intensity of the workout.",
          adOrientation: "Bright and motivating theme",
          adCreativeId: "66230a72d94c2c7088394b02",
          rationale:
            "This ad showcases the speed and effectiveness of EMS training in achieving toned muscles, aligning with the target audience's desire for quick results.",
          createdAt: "2024-04-20T00:21:06.263Z",
          updatedAt: "2024-04-20T00:21:06.263Z",
        },
        {
          id: "66230a73d94c2c7088394b04",
          variantNo: "2",
          adType: "Instagram Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66230a73d94c2c7088394b04_1713572587672.png",
          oneLiner: "Fitness redefined, results amplified!",
          text: "Discover the power of EMS training at our Long Island City gym! Tailored programs for women in every stage, safe and efficient workouts, and a supportive environment. Claim your special offer today!",
          posts: [],
          imageDescription:
            "The ad showcases before-and-after images of women who have experienced transformational results with EMS training. The style is impactful and inspiring, highlighting the visible changes in physique.",
          adOrientation: "Transformational success theme",
          adCreativeId: "66230a72d94c2c7088394b02",
          rationale:
            "This ad emphasizes the transformative outcomes of EMS fitness, resonating with women's desire for body shaping and overall fitness improvement.",
          createdAt: "2024-04-20T00:21:06.263Z",
          updatedAt: "2024-04-20T00:21:06.263Z",
        },
      ],
    },
    {
      id: "66230ba8d94c2c7088394b08",
      conversationId: "6610e227211119401c79b489",
      adObjective:
        "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group.",
      json: '{\n  "summary": "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women\'s fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",\n  "variants": [\n    {\n      "confidence": "90%",\n      "adType": "Facebook Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Feel the burn, see the results!",\n      "imageDescription": "The ad features women from diverse backgrounds engaged in group EMS fitness sessions with smiles and determination. The style is authentic and motivating, capturing the camaraderie and energy of the workout.",\n      "adOrientation": "Inclusive and empowering theme",\n      "rationale": "This ad showcases the community aspect of EMS training, highlighting the support and encouragement that women can experience while achieving their fitness goals.",\n      "text": "Join our empowering fitness community at the next-gen EMS gym in Long Island City! Personalized programs, inclusive environment, and effective workouts for women of all ages. Start your journey now!",\n      "campaignName":"EmpowerHer Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Community Fit",\n      "adName":"Burn & Glow"\n    },\n    {\n      "confidence": "85%",\n      "adType": "Instagram Ad",\n      "variantNo": "2",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Strength, grace, amplified results!",\n      "imageDescription": "The ad showcases a woman in a graceful yoga pose juxtaposed with a dynamic EMS workout session. The style is elegant yet powerful, symbolizing the balance between strength and flexibility.",\n      "adOrientation": "Elegance and power theme",\n      "rationale": "This ad appeals to women\'s desire for a balanced fitness approach, combining strength training with gracefulness and emphasizing the amplified results of EMS fitness.",\n      "text": "Experience the beauty of strength with EMS training at our Long Island City gym! Balance, power, and transformation await you in a welcoming and supportive environment. Discover your potential today!",\n      "campaignName":"Graceful Strength Fitness",\n      "campaignObjective":"app_promotion",\n      "adsetName":"Strength & Serenity",\n      "adName":"Graceful Amplify"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To promote the unique features and personalized offerings of the EMS gym targeted at women in the 25-50 age group."\n}',
      companyName: "Amplified EMS Gym",
      messageId: "66230b9a575b3e513bf4ea84",
      disclaimer:
        "Results may vary. Consult with a fitness professional before starting any new exercise program.",
      summary:
        "The EMS gym in Long Island City specifically targets women in the 25-50 age group with personalized training programs focused on weight management, muscle strengthening, body shaping, and overall fitness improvement. The gym offers unique features and equipment tailored to women's fitness goals at different life stages, along with a welcoming and empowering ambiance. Special promotions, partnerships with nutritionists, and adaptations for individual fitness levels enhance the value proposition for women.",
      createdAt: "2024-04-20T00:26:16.055Z",
      updatedAt: "2024-04-20T00:26:16.055Z",
      variants: [
        {
          id: "66230ba9d94c2c7088394b0a",
          variantNo: "2",
          adType: "Instagram Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66230ba9d94c2c7088394b0a_1713572831042.png",
          oneLiner: "Strength, grace, amplified results!",
          text: "Experience the beauty of strength with EMS training at our Long Island City gym! Balance, power, and transformation await you in a welcoming and supportive environment. Discover your potential today!",
          posts: [],
          imageDescription:
            "The ad showcases a woman in a graceful yoga pose juxtaposed with a dynamic EMS workout session. The style is elegant yet powerful, symbolizing the balance between strength and flexibility.",
          adOrientation: "Elegance and power theme",
          adCreativeId: "66230ba8d94c2c7088394b08",
          rationale:
            "This ad appeals to women's desire for a balanced fitness approach, combining strength training with gracefulness and emphasizing the amplified results of EMS fitness.",
          createdAt: "2024-04-20T00:26:16.055Z",
          updatedAt: "2024-04-20T00:26:16.055Z",
        },
        {
          id: "66230ba8d94c2c7088394b09",
          variantNo: "1",
          adType: "Facebook Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66230ba8d94c2c7088394b09_1713572802222.png",
          oneLiner: "Feel the burn, see the results!",
          text: "Join our empowering fitness community at the next-gen EMS gym in Long Island City! Personalized programs, inclusive environment, and effective workouts for women of all ages. Start your journey now!",
          posts: [],
          imageDescription:
            "The ad features women from diverse backgrounds engaged in group EMS fitness sessions with smiles and determination. The style is authentic and motivating, capturing the camaraderie and energy of the workout.",
          adOrientation: "Inclusive and empowering theme",
          adCreativeId: "66230ba8d94c2c7088394b08",
          rationale:
            "This ad showcases the community aspect of EMS training, highlighting the support and encouragement that women can experience while achieving their fitness goals.",
          createdAt: "2024-04-20T00:26:16.055Z",
          updatedAt: "2024-04-20T00:26:16.055Z",
        },
      ],
    },
    {
      id: "662515336ee95fa4052c2c75",
      conversationId: "6610e227211119401c79b489",
      adObjective:
        "To create a memorable and engaging ad featuring rabbits using EMS technology to attract women in the 25-50 age group to the gym.",
      json: '{\n  "summary": "The EMS gym in Long Island City is looking to create an engaging ad featuring rabbits using EMS technology to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and innovation of EMS training in a fun and unconventional way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Hop into fitness with EMS - bunnies\' choice!",\n      "imageDescription": "The ad features adorable animated rabbits wearing EMS training gear, engaging in workout activities in a whimsical and energetic setting. The style is playful and colorful, sparking curiosity and interest in EMS fitness.",\n      "adOrientation": "Whimsical and energetic theme",\n      "rationale": "This ad leverages the charm of rabbits to capture attention and create a memorable connection to the innovative EMS technology, appealing to the target audience\'s sense of fun and adventure.",\n      "text": "Join the fun with EMS training at our gym in Long Island City! Experience a workout like never before, endorsed by the bunnies themselves. Discover the joy of effective and efficient fitness today!",\n      "campaignName":"BunnyFit",\n      "campaignObjective":"engagement",\n      "adsetName":"Rabbit Workout",\n      "adName":"Hop & Tone"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Energize your workout with rabbit-approved EMS!",\n      "imageDescription": "The video ad showcases rabbits in different EMS training scenarios, interspersed with clips of women in the gym undergoing similar exercises. The style is dynamic and upbeat, highlighting the connection between animal agility and human fitness.",\n      "adOrientation": "Dynamic and engaging theme",\n      "rationale": "This video ad creates a visually compelling narrative by juxtaposing rabbits\' natural agility with women\'s fitness journey, emphasizing the effectiveness and excitement of EMS workouts for women.",\n      "text": "Revamp your workout routine and unleash your inner bunny with EMS fitness at our Long Island City gym! Let the bunnies inspire you to hop, jump, and tone your way to a fitter you. Join the rabbit revolution today!",\n      "campaignName":"RabbitRush Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Bunny Boost",\n      "adName":"Fit & Fuzzy"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create a memorable and engaging ad featuring rabbits using EMS technology to attract women in the 25-50 age group to the gym."\n}',
      companyName: "Amplified EMS Gym",
      messageId: "662515241f37e96ae8c7b00e",
      disclaimer:
        "Results may vary. Consult with a fitness professional before starting any new exercise program.",
      summary:
        "The EMS gym in Long Island City is looking to create an engaging ad featuring rabbits using EMS technology to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and innovation of EMS training in a fun and unconventional way.",
      createdAt: "2024-04-21T13:31:31.302Z",
      updatedAt: "2024-04-21T13:31:31.302Z",
      variants: [
        {
          id: "662515346ee95fa4052c2c76",
          variantNo: "1",
          adType: "Digital Banner Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/662515346ee95fa4052c2c76_1713706336624.png",
          oneLiner: "Hop into fitness with EMS - bunnies' choice!",
          text: "Join the fun with EMS training at our gym in Long Island City! Experience a workout like never before, endorsed by the bunnies themselves. Discover the joy of effective and efficient fitness today!",
          posts: [],
          imageDescription:
            "The ad features adorable animated rabbits wearing EMS training gear, engaging in workout activities in a whimsical and energetic setting. The style is playful and colorful, sparking curiosity and interest in EMS fitness.",
          adOrientation: "Whimsical and energetic theme",
          adCreativeId: "662515336ee95fa4052c2c75",
          rationale:
            "This ad leverages the charm of rabbits to capture attention and create a memorable connection to the innovative EMS technology, appealing to the target audience's sense of fun and adventure.",
          createdAt: "2024-04-21T13:31:31.302Z",
          updatedAt: "2024-04-21T13:31:31.302Z",
        },
        {
          id: "662515346ee95fa4052c2c77",
          variantNo: "2",
          adType: "Social Media Video Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/662515346ee95fa4052c2c77_1713706345090.png",
          oneLiner: "Energize your workout with rabbit-approved EMS!",
          text: "Revamp your workout routine and unleash your inner bunny with EMS fitness at our Long Island City gym! Let the bunnies inspire you to hop, jump, and tone your way to a fitter you. Join the rabbit revolution today!",
          posts: [],
          imageDescription:
            "The video ad showcases rabbits in different EMS training scenarios, interspersed with clips of women in the gym undergoing similar exercises. The style is dynamic and upbeat, highlighting the connection between animal agility and human fitness.",
          adOrientation: "Dynamic and engaging theme",
          adCreativeId: "662515336ee95fa4052c2c75",
          rationale:
            "This video ad creates a visually compelling narrative by juxtaposing rabbits' natural agility with women's fitness journey, emphasizing the effectiveness and excitement of EMS workouts for women.",
          createdAt: "2024-04-21T13:31:31.302Z",
          updatedAt: "2024-04-21T13:31:31.302Z",
        },
      ],
    },
    {
      id: "6627a79e7171bbf59869a68a",
      conversationId: "6610e227211119401c79b489",
      adObjective:
        "To create an engaging and playful ad featuring dogs using EMS technology to attract women in the 25-50 age group to the gym.",
      json: '{\n  "summary": "The EMS gym in Long Island City is exploring the idea of creating an ad featuring dogs using EMS technology to showcase the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to highlight the fun and innovative aspects of EMS training in a playful and engaging manner.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Paw-fect fitness with EMS - dogs\' choice!",\n      "imageDescription": "The ad presents animated dogs in workout gear participating in EMS exercises with enthusiasm and energy in a cheerful and vibrant setting. The style is playful and colorful, invoking a sense of joy and activity in the viewer.",\n      "adOrientation": "Playful and vibrant theme",\n      "rationale": "This ad leverages the universal appeal of dogs to create a heartwarming and entertaining connection to the exciting EMS technology, appealing to the target audience\'s love for animals and fitness.",\n      "text": "Unleash the power of EMS training at our Long Island City gym - approved by our furry friends! Experience a workout that leaves tails wagging and spirits high. Join the canine crew for a paw-some fitness journey today!",\n      "campaignName":"DogFit",\n      "campaignObjective":"engagement",\n      "adsetName":"Canine Workout",\n      "adName":"Paw & Pulse"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Fetch your fitness goals with dog-approved EMS!",\n      "imageDescription": "The video ad showcases dogs of various breeds engaging in EMS training activities, interspersed with clips of women in the gym performing similar exercises. The style is dynamic and heartwarming, emphasizing the connection between canine agility and human fitness commitment.",\n      "adOrientation": "Dynamic and heartwarming theme",\n      "rationale": "This video ad creates an engaging and relatable narrative by showcasing dogs\' energy and enthusiasm alongside women\'s fitness efforts, highlighting the joy and effectiveness of EMS workouts for women.",\n      "text": "Chase away the boredom in your workout routine and embrace the doggo way with EMS fitness at our Long Island City gym! Let our furry friends motivate you to jump, run, and tone your way to a healthier you. Join the canine workout revolution today!",\n      "campaignName":"DoggoFit Journey",\n      "campaignObjective":"engagement",\n      "adsetName":"Doggy Fitness Boost",\n      "adName":"Fit & Furry"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create an engaging and playful ad featuring dogs using EMS technology to attract women in the 25-50 age group to the gym."\n}',
      companyName: "Amplified EMS Gym",
      messageId: "6627a78b5806ed7b85648068",
      disclaimer:
        "Results may vary. Consult with a fitness professional before starting any new exercise program.",
      summary:
        "The EMS gym in Long Island City is exploring the idea of creating an ad featuring dogs using EMS technology to showcase the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to highlight the fun and innovative aspects of EMS training in a playful and engaging manner.",
      createdAt: "2024-04-23T12:20:45.851Z",
      updatedAt: "2024-04-23T12:20:45.851Z",
      variants: [
        {
          id: "6627a79e7171bbf59869a68b",
          variantNo: "1",
          adType: "Digital Banner Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/6627a79e7171bbf59869a68b_1713874935397.png",
          oneLiner: "Paw-fect fitness with EMS - dogs' choice!",
          text: "Unleash the power of EMS training at our Long Island City gym - approved by our furry friends! Experience a workout that leaves tails wagging and spirits high. Join the canine crew for a paw-some fitness journey today!",
          posts: [],
          imageDescription:
            "The ad presents animated dogs in workout gear participating in EMS exercises with enthusiasm and energy in a cheerful and vibrant setting. The style is playful and colorful, invoking a sense of joy and activity in the viewer.",
          adOrientation: "Playful and vibrant theme",
          adCreativeId: "6627a79e7171bbf59869a68a",
          rationale:
            "This ad leverages the universal appeal of dogs to create a heartwarming and entertaining connection to the exciting EMS technology, appealing to the target audience's love for animals and fitness.",
          createdAt: "2024-04-23T12:20:45.851Z",
          updatedAt: "2024-04-23T12:20:45.851Z",
        },
        {
          id: "6627a79e7171bbf59869a68c",
          variantNo: "2",
          adType: "Social Media Video Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/6627a79e7171bbf59869a68c_1713874934928.png",
          oneLiner: "Fetch your fitness goals with dog-approved EMS!",
          text: "Chase away the boredom in your workout routine and embrace the doggo way with EMS fitness at our Long Island City gym! Let our furry friends motivate you to jump, run, and tone your way to a healthier you. Join the canine workout revolution today!",
          posts: [],
          imageDescription:
            "The video ad showcases dogs of various breeds engaging in EMS training activities, interspersed with clips of women in the gym performing similar exercises. The style is dynamic and heartwarming, emphasizing the connection between canine agility and human fitness commitment.",
          adOrientation: "Dynamic and heartwarming theme",
          adCreativeId: "6627a79e7171bbf59869a68a",
          rationale:
            "This video ad creates an engaging and relatable narrative by showcasing dogs' energy and enthusiasm alongside women's fitness efforts, highlighting the joy and effectiveness of EMS workouts for women.",
          createdAt: "2024-04-23T12:20:45.851Z",
          updatedAt: "2024-04-23T12:20:45.851Z",
        },
      ],
    },
    {
      id: "6627a9967171bbf59869a68e",
      conversationId: "6610e227211119401c79b489",
      adObjective:
        "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym.",
      json: '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Power up your workout with EMS intensity!",\n      "imageDescription": "The ad portrays diverse individuals actively participating in EMS training sessions, showcasing their dedication and focus in a modern and dynamic setting. The style is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",\n      "adOrientation": "Energetic and empowering theme",\n      "rationale": "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience\'s aspirations for fitness progress and transformation.",\n      "text": "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",\n      "campaignName":"EnergyBoost Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Intensity Pro",\n      "adName":"Power Moves"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Transform your body with EMS innovation!",\n      "imageDescription": "The video ad showcases individuals in action during EMS training sessions, highlighting the intensity and focus of their workouts. The style is dynamic and motivational, illustrating the potential for transformation through EMS fitness.",\n      "adOrientation": "Dynamic and motivational theme",\n      "rationale": "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",\n      "text": "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",\n      "campaignName":"Transformation Effect",\n      "campaignObjective":"engagement",\n      "adsetName":"Body Transformation",\n      "adName":"Innovation Fit"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym."\n}',
      companyName: "Amplified EMS Gym",
      messageId: "6627a98369829e42e4cf5e9b",
      disclaimer:
        "Results may vary. Consult with a fitness professional before starting any new exercise program.",
      summary:
        "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",
      createdAt: "2024-04-23T12:29:10.308Z",
      updatedAt: "2024-04-23T12:29:10.308Z",
      variants: [
        {
          id: "6627a9977171bbf59869a690",
          variantNo: "2",
          adType: "Social Media Video Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/6627a9977171bbf59869a690_1713875429040.png",
          oneLiner: "Transform your body with EMS innovation!",
          text: "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",
          posts: [],
          imageDescription:
            "The video ad showcases individuals in action during EMS training sessions, highlighting the intensity and focus of their workouts. The style is dynamic and motivational, illustrating the potential for transformation through EMS fitness.",
          adOrientation: "Dynamic and motivational theme",
          adCreativeId: "6627a9967171bbf59869a68e",
          rationale:
            "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",
          createdAt: "2024-04-23T12:29:10.308Z",
          updatedAt: "2024-04-23T12:29:10.308Z",
        },
        {
          id: "6627a9977171bbf59869a68f",
          variantNo: "1",
          adType: "Digital Banner Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/6627a9977171bbf59869a68f_1713875422996.png",
          oneLiner: "Power up your workout with EMS intensity!",
          text: "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",
          posts: [],
          imageDescription:
            "The ad portrays diverse individuals actively participating in EMS training sessions, showcasing their dedication and focus in a modern and dynamic setting. The style is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",
          adOrientation: "Energetic and empowering theme",
          adCreativeId: "6627a9967171bbf59869a68e",
          rationale:
            "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience's aspirations for fitness progress and transformation.",
          createdAt: "2024-04-23T12:29:10.308Z",
          updatedAt: "2024-04-23T12:29:10.308Z",
        },
      ],
    },
    {
      id: "662883847171bbf59869a692",
      conversationId: "6610e227211119401c79b489",
      adObjective:
        "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym.",
      json: '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Power up your workout with EMS intensity!",\n      "imageDescription": "The ad depicts diverse individuals actively participating in EMS training sessions with the text \'EMS Intensity\' prominently displayed at the top. It showcases their dedication and focus in a modern and dynamic setting, with a style that is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",\n      "adOrientation": "Energetic and empowering theme",\n      "rationale": "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience\'s aspirations for fitness progress and transformation.",\n      "text": "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",\n      "campaignName":"EnergyBoost Fitness",\n      "campaignObjective":"engagement",\n      "adsetName":"Intensity Pro",\n      "adName":"Power Moves"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Transform your body with EMS innovation!",\n      "imageDescription": "The video ad showcases individuals in action during EMS training sessions with the text \'EMS Innovation\' displayed prominently at the top. It highlights the intensity and focus of their workouts in a dynamic and motivational style, illustrating the potential for transformation through EMS fitness.",\n      "adOrientation": "Dynamic and motivational theme",\n      "rationale": "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",\n      "text": "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",\n      "campaignName":"Transformation Effect",\n      "campaignObjective":"engagement",\n      "adsetName":"Body Transformation",\n      "adName":"Innovation Fit"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads showcasing individuals engaging in EMS training to attract women in the 25-50 age group to the gym."\n}',
      companyName: "Amplified EMS Gym",
      messageId: "6628837597ff579e240d6fd3",
      disclaimer:
        "Results may vary. Consult with a fitness professional before starting any new exercise program.",
      summary:
        "The EMS gym in Long Island City is considering an ad featuring individuals engaged in EMS training to promote the unique fitness offerings targeted at women in the 25-50 age group. The ad aims to showcase the effectiveness and intensity of EMS workouts in a visually compelling and motivating way.",
      createdAt: "2024-04-24T03:58:59.835Z",
      updatedAt: "2024-04-24T03:58:59.835Z",
      variants: [
        {
          id: "662883847171bbf59869a694",
          variantNo: "2",
          adType: "Social Media Video Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/662883847171bbf59869a694_1713931177251.png",
          oneLiner: "Transform your body with EMS innovation!",
          text: "Experience a new level of fitness with EMS training at our Long Island City gym! Witness the transformative results of high-intensity workouts tailored to your goals and lifestyle. Start your fitness evolution today!",
          posts: [],
          imageDescription:
            "The video ad showcases individuals in action during EMS training sessions with the text 'EMS Innovation' displayed prominently at the top. It highlights the intensity and focus of their workouts in a dynamic and motivational style, illustrating the potential for transformation through EMS fitness.",
          adOrientation: "Dynamic and motivational theme",
          adCreativeId: "662883847171bbf59869a692",
          rationale:
            "This video ad conveys the impact and transformative power of EMS training by showcasing real individuals pushing their limits and achieving fitness goals, inspiring the target audience to embark on their own journey.",
          createdAt: "2024-04-24T03:58:59.835Z",
          updatedAt: "2024-04-24T03:58:59.835Z",
        },
        {
          id: "662883847171bbf59869a693",
          variantNo: "1",
          adType: "Digital Banner Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/662883847171bbf59869a693_1713931176793.png",
          oneLiner: "Power up your workout with EMS intensity!",
          text: "Elevate your fitness journey with EMS training at our Long Island City gym! Experience the power of high-intensity workouts that deliver real results in less time. Join the movement towards a stronger, fitter you today!",
          posts: [],
          imageDescription:
            "The ad depicts diverse individuals actively participating in EMS training sessions with the text 'EMS Intensity' prominently displayed at the top. It showcases their dedication and focus in a modern and dynamic setting, with a style that is energetic and empowering, highlighting the intensity and effectiveness of EMS workouts.",
          adOrientation: "Energetic and empowering theme",
          adCreativeId: "662883847171bbf59869a692",
          rationale:
            "This ad captures the essence of EMS training by emphasizing the commitment and results-driven approach of individuals, resonating with the target audience's aspirations for fitness progress and transformation.",
          createdAt: "2024-04-24T03:58:59.835Z",
          updatedAt: "2024-04-24T03:58:59.835Z",
        },
      ],
    },
    {
      id: "66289b737171bbf59869a696",
      conversationId: "6610e227211119401c79b489",
      adObjective:
        "To create engaging ads featuring raccoons typing on a computer to symbolize the innovative and fun nature of EMS training for women in the 25-50 age group.",
      json: '{\n  "summary": "The EMS gym in Long Island City is considering an ad featuring raccoons typing on a computer to symbolize the innovative and engaging nature of EMS training. The ad aims to appeal to women in the 25-50 age group by showcasing the unconventional and fun aspects of EMS workouts in a visually interesting manner.",\n  "variants": [\n    {\n      "confidence": "70%",\n      "adType": "Digital Banner Ad",\n      "variantNo": "1",\n      "imageUrl": "{Image URL}",\n      "oneLiner": "Join the raccoon squad for EMS success!",\n      "imageDescription": "The ad portrays raccoons typing on a computer with the text \'EMS Magic\' displayed above them. It presents a whimsical and humorous scene that symbolizes the innovative approach of EMS training, capturing attention in a unique and entertaining way.",\n      "adOrientation": "Whimsical and engaging theme",\n      "rationale": "This ad leverages the charm and curiosity associated with raccoons to create a memorable and light-hearted connection to EMS technology, appealing to the target audience\'s sense of fun and creativity.",\n      "text": "Step into the world of EMS magic at our Long Island City gym! Let the raccoon squad guide you on a journey to fitness success with high-intensity workouts and innovative training techniques. Join the fun today!",\n      "campaignName":"RaccoonFit Adventures",\n      "campaignObjective":"engagement",\n      "adsetName":"Raccoon Revolution",\n      "adName":"Magic Typing"\n    },\n    {\n      "confidence": "65%",\n      "adType": "Social Media Video Ad",\n      "variantNo": "2",\n      "imageUrl": "{Video URL}",\n      "oneLiner": "Uncover the secret to fitness with the raccoon crew!",\n      "imageDescription": "The video ad features raccoons typing on a computer interspersed with clips of individuals engaged in EMS training. The text \'EMS Discovery\' is highlighted throughout the video, creating a playful and intriguing visual narrative that emphasizes the innovative nature of EMS workouts.",\n      "adOrientation": "Playful and intriguing theme",\n      "rationale": "This video ad combines the antics of raccoons with the intensity of EMS training to create an engaging and memorable storyline, drawing viewers into the world of fitness exploration and excitement.",\n      "text": "Embark on a fitness journey like no other with the raccoon crew at our Long Island City gym! Discover the secret to successful workouts with EMS technology and experience the joy of transformative fitness. Join the adventure today!",\n      "campaignName":"RaccoonFitness Quest",\n      "campaignObjective":"engagement",\n      "adsetName":"Discovery Crew",\n      "adName":"Fit Explorers"\n    }\n  ],\n  "disclaimer": "Results may vary. Consult with a fitness professional before starting any new exercise program.",\n  "companyName": "Amplified EMS Gym",\n  "adObjective": "To create engaging ads featuring raccoons typing on a computer to symbolize the innovative and fun nature of EMS training for women in the 25-50 age group."\n}',
      companyName: "Amplified EMS Gym",
      messageId: "66289b62a367b6943de7ab8f",
      disclaimer:
        "Results may vary. Consult with a fitness professional before starting any new exercise program.",
      summary:
        "The EMS gym in Long Island City is considering an ad featuring raccoons typing on a computer to symbolize the innovative and engaging nature of EMS training. The ad aims to appeal to women in the 25-50 age group by showcasing the unconventional and fun aspects of EMS workouts in a visually interesting manner.",
      createdAt: "2024-04-24T05:41:07.301Z",
      updatedAt: "2024-04-24T05:41:07.301Z",
      variants: [
        {
          id: "66289b747171bbf59869a697",
          variantNo: "1",
          adType: "Digital Banner Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66289b747171bbf59869a697_1713937382067.png",
          oneLiner: "Join the raccoon squad for EMS success!",
          text: "Step into the world of EMS magic at our Long Island City gym! Let the raccoon squad guide you on a journey to fitness success with high-intensity workouts and innovative training techniques. Join the fun today!",
          posts: [],
          imageDescription:
            "The ad portrays raccoons typing on a computer with the text 'EMS Magic' displayed above them. It presents a whimsical and humorous scene that symbolizes the innovative approach of EMS training, capturing attention in a unique and entertaining way.",
          adOrientation: "Whimsical and engaging theme",
          adCreativeId: "66289b737171bbf59869a696",
          rationale:
            "This ad leverages the charm and curiosity associated with raccoons to create a memorable and light-hearted connection to EMS technology, appealing to the target audience's sense of fun and creativity.",
          createdAt: "2024-04-24T05:41:07.301Z",
          updatedAt: "2024-04-24T05:41:07.301Z",
        },
        {
          id: "66289b747171bbf59869a698",
          variantNo: "2",
          adType: "Social Media Video Ad",
          image: null,
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/66289b747171bbf59869a698_1713937382567.png",
          oneLiner: "Uncover the secret to fitness with the raccoon crew!",
          text: "Embark on a fitness journey like no other with the raccoon crew at our Long Island City gym! Discover the secret to successful workouts with EMS technology and experience the joy of transformative fitness. Join the adventure today!",
          posts: [],
          imageDescription:
            "The video ad features raccoons typing on a computer interspersed with clips of individuals engaged in EMS training. The text 'EMS Discovery' is highlighted throughout the video, creating a playful and intriguing visual narrative that emphasizes the innovative nature of EMS workouts.",
          adOrientation: "Playful and intriguing theme",
          adCreativeId: "66289b737171bbf59869a696",
          rationale:
            "This video ad combines the antics of raccoons with the intensity of EMS training to create an engaging and memorable storyline, drawing viewers into the world of fitness exploration and excitement.",
          createdAt: "2024-04-24T05:41:07.301Z",
          updatedAt: "2024-04-24T05:41:07.301Z",
        },
      ],
    },
  ],
  adCampaigns: [
    {
      id: "6610e2dda5a15cb890b0c8d4",
      campaignId: "120207183720580340",
      adAccountId: "act_167093713134679",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [
        {
          id: "6610e2dda5a15cb890b0c8d5",
          adsetId: "120207183720570340",
          adAccountId: "act_167093713134679",
          accessToken:
            "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
          adCreativeId: "6610e227211119401c79b48b",
          userId: "66040baff5ac2361ea74a338",
          campaignId: "120207183720580340",
          ads: [
            {
              id: "6610e2dda5a15cb890b0c8d6",
              adId: "120207183720600340",
              adsetId: "120207183720570340",
              adAccountId: "act_167093713134679",
              accessToken:
                "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
              variantId: "6610e227211119401c79b48c",
              userId: "66040baff5ac2361ea74a338",
            },
            {
              id: "6610e2dda5a15cb890b0c8d7",
              adId: "120207227499020340",
              adsetId: "120207183720570340",
              adAccountId: "act_167093713134679",
              accessToken:
                "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
              variantId: "6610e227211119401c79b48d",
              userId: "66040baff5ac2361ea74a338",
            },
            {
              id: "6610e2dda5a15cb890b0c8d8",
              adId: "120207183720610340",
              adsetId: "120207183720570340",
              adAccountId: "act_167093713134679",
              accessToken:
                "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
              variantId: "6610e227211119401c79b48e",
              userId: "66040baff5ac2361ea74a338",
            },
            {
              id: "6610e2dda5a15cb890b0c8d9",
              adId: "120207183720590340",
              adsetId: "120207183720570340",
              adAccountId: "act_167093713134679",
              accessToken:
                "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
              variantId: "6610e227211119401c79b48f",
              userId: "66040baff5ac2361ea74a338",
            },
          ],
        },
      ],
    },
    {
      id: "66230bfad94c2c7088394b0c",
      campaignId: "120207439270050276",
      adAccountId: "act_1474075663389375",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
    {
      id: "66230c02d94c2c7088394b0d",
      campaignId: "120207439270680276",
      adAccountId: "act_1474075663389375",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
    {
      id: "66230c22d94c2c7088394b0e",
      campaignId: "120207812065530213",
      adAccountId: "act_309641871929008",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
    {
      id: "66230c3dd94c2c7088394b0f",
      campaignId: "120207812067650213",
      adAccountId: "act_309641871929008",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
    {
      id: "662330fed94c2c7088394b11",
      campaignId: "120207814419710213",
      adAccountId: "act_309641871929008",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
    {
      id: "66233424d94c2c7088394b12",
      campaignId: "120207815025130213",
      adAccountId: "act_309641871929008",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
    {
      id: "66235e56d94c2c7088394b13",
      campaignId: "120207818024790213",
      adAccountId: "act_309641871929008",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
    {
      id: "6627471662d477bd27509102",
      campaignId: "120208365474770340",
      adAccountId: "act_167093713134679",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
    {
      id: "6627a62f7171bbf59869a689",
      campaignId: "120207930942550213",
      adAccountId: "act_309641871929008",
      accessToken:
        "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
      userId: "66040baff5ac2361ea74a338",
      conversationId: "6610e227211119401c79b489",
      adsets: [],
    },
  ],
};

const mockConfig = {
  renderComponent: () =>
    render(
      <Providers>
        <UserContextProvider status="loading">
          <SnackbarContextProvider>
            <EditVariantContextProvider>
              <CurrentConversationContextProvider
                conversation={mockedConversation as any}
              >
                <ClientMessageContextProvider>
                  <>
                    <AdItem
                      isClient={false}
                      messageItem={adCreativeMessageMock() as any}
                    />
                    <Snackbar />
                  </>
                </ClientMessageContextProvider>
              </CurrentConversationContextProvider>
            </EditVariantContextProvider>
          </SnackbarContextProvider>
        </UserContextProvider>
      </Providers>
    ),
  testUser: {
    createdAt: null,
    email: "test@example.com",
    emailVerified: null,
    first_name: "Test",
    id: "123",
    image: null,
    last_name: "User",
    updatedAt: null,
  },
};

const mockedAdSet = {
  account_id: "167093713134679",
  campaign: {
    objective: "OUTCOME_LEADS",
    id: "120207183720580340",
  },
  name: "ARTI AI - Direct Leads Ad Set",
  optimization_goal: "LEAD_GENERATION",
  bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  status: "ACTIVE",
  effective_status: "ACTIVE",
  daily_budget: "1000",
  targeting: {
    age_max: 65,
    age_min: 18,
    age_range: [25, 60],
    flexible_spec: [
      {
        interests: [
          {
            id: "6002868910910",
            name: "Organic food",
          },
          {
            id: "6002969332394",
            name: "Zumba Dance",
          },
          {
            id: "6003125839188",
            name: "Sauna",
          },
          {
            id: "6003150658378",
            name: "High-intensity interval training",
          },
          {
            id: "6003152135258",
            name: "GoodLife Fitness",
          },
          {
            id: "6003159020675",
            name: "Pilates",
          },
          {
            id: "6003187627566",
            name: "Toning exercises",
          },
          {
            id: "6003213657133",
            name: "Fitness and figure competition",
          },
          {
            id: "6003229335698",
            name: "Healthy Lifestyles",
          },
          {
            id: "6003248665001",
            name: "Bodyfit",
          },
          {
            id: "6003258544357",
            name: "Health & wellness",
          },
          {
            id: "6003277229371",
            name: "Physical fitness",
          },
          {
            id: "6003306084421",
            name: "Yoga",
          },
          {
            id: "6003325329736",
            name: "General fitness training",
          },
          {
            id: "6003335697456",
            name: "Facial",
          },
          {
            id: "6003344968239",
            name: "Fitness boot camp",
          },
          {
            id: "6003347748581",
            name: "Equinox Fitness",
          },
          {
            id: "6003382102565",
            name: "Healthy diet",
          },
          {
            id: "6003384248805",
            name: "Fitness and wellness",
          },
          {
            id: "6003451832471",
            name: "LA Fitness",
          },
          {
            id: "6003474973243",
            name: "Hot yoga",
          },
          {
            id: "6003485046280",
            name: "Aerobics",
          },
          {
            id: "6003648059946",
            name: "Bodybuilding",
          },
          {
            id: "6003663933307",
            name: "Functional Fitness",
          },
          {
            id: "6003745745504",
            name: "healthy eating recipes",
          },
          {
            id: "6004115167424",
            name: "Physical exercise",
          },
        ],
      },
    ],
    geo_locations: {
      zips: [
        {
          key: "US:11010",
          name: "11010",
          primary_city_id: 2488643,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11422",
          name: "11422",
          primary_city_id: 2490299,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11516",
          name: "11516",
          primary_city_id: 2487613,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11518",
          name: "11518",
          primary_city_id: 2488302,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11520",
          name: "11520",
          primary_city_id: 2488654,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11530",
          name: "11530",
          primary_city_id: 2488711,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11557",
          name: "11557",
          primary_city_id: 2489139,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11558",
          name: "11558",
          primary_city_id: 2487085,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11559",
          name: "11559",
          primary_city_id: 2489626,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11561",
          name: "11561",
          primary_city_id: 2489757,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11563",
          name: "11563",
          primary_city_id: 2489811,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11565",
          name: "11565",
          primary_city_id: 2489858,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11570",
          name: "11570",
          primary_city_id: 2491178,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11572",
          name: "11572",
          primary_city_id: 2490544,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11580",
          name: "11580",
          primary_city_id: 2492114,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11581",
          name: "11581",
          primary_city_id: 2492114,
          region_id: 3875,
          country: "US",
        },
        {
          key: "US:11598",
          name: "11598",
          primary_city_id: 2492598,
          region_id: 3875,
          country: "US",
        },
      ],
      location_types: ["home", "recent"],
    },
    brand_safety_content_filter_levels: ["FACEBOOK_STANDARD", "AN_STANDARD"],
    targeting_automation: {
      advantage_audience: 1,
    },
  },
  promoted_object: {
    page_id: "102748119548466",
  },
  billing_event: "IMPRESSIONS",
  start_time: "2024-03-18T06:30:00-0400",
  destination_type: "ON_AD",
  insights: {
    data: [
      {
        impressions: "18136",
        reach: "11212",
        spend: "693.27",
        clicks: "350",
        unique_clicks: "234",
        ctr: "1.929863",
        actions: [
          {
            action_type: "landing_page_view",
            value: "22",
          },
          {
            action_type: "onsite_conversion.post_save",
            value: "14",
          },
          {
            action_type: "page_engagement",
            value: "280",
          },
          {
            action_type: "post_engagement",
            value: "281",
          },
          {
            action_type: "post",
            value: "8",
          },
          {
            action_type: "lead",
            value: "57",
          },
          {
            action_type: "leadgen_grouped",
            value: "57",
          },
          {
            action_type: "onsite_conversion.lead_grouped",
            value: "57",
          },
          {
            action_type: "post_reaction",
            value: "54",
          },
          {
            action_type: "link_click",
            value: "204",
          },
        ],
        cpm: "38.22618",
        account_currency: "USD",
        adset_id: "120207183720570340",
        date_start: "2024-04-04",
        date_stop: "2024-05-03",
      },
    ],
    paging: {
      cursors: {
        before: "MAZDZD",
        after: "MAZDZD",
      },
    },
  },
  id: "120207183720570340",
};

jest.mock("@/api/user", () => ({
  useGetUserProviders: jest.fn(() => ({
    data: [],
    isFetching: false,
  })),
  useGetMe: jest.fn(() => ({
    data: mockConfig.testUser,
    isSuccess: true,
    isFetching: false,
  })),
  useUserPages: jest.fn(() => ({
    data: undefined,
    isFetching: false,
  })),
  useGetAdAccounts: jest.fn(() => ({
    data: undefined,
    isFetching: false,
  })),
  useLinkAccount: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
  useGetAdSet: jest.fn(() => ({
    data: mockedAdSet,
    isLoading: true,
    isSuccess: false,
  })),
  useGetFacebookPage: jest.fn(() => ({
    data: undefined,
    isFetching: false,
  })),
  useGetVariantPosts: jest.fn(() => ({
    data: [],
    isFetching: false,
  })),
  prefixAccountId: jest.fn(),
  useCredentials: jest.fn(() => ({
    accessToken: "",
    accountId: "",
    isFetching: false,
  })),
}));

describe("AdItem", () => {
  beforeEach(() => {
    window.fetch = jest.fn();
    window.scrollTo = jest.fn();
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should render AdItem", () => {
    mockConfig.renderComponent();
    expect(screen.getByText("Ad Summary")).toBeInTheDocument();
  });

  it("should show spinner while fetching ad insights", () => {
    mockConfig.renderComponent();
    (useGetAdSet as jest.Mock).mockReturnValue({
      data: mockedAdSet,
      isLoading: true,
      isSuccess: false,
    });
    expect(
      screen.getByTestId("fetching-ad-insights-spinner")
    ).toBeInTheDocument();
  });

  it("should show ad insights collapse card when insights are fetched successfully!", () => {
    mockConfig.renderComponent();
    (useGetAdSet as jest.Mock).mockReturnValue({
      data: mockedAdSet,
      isLoading: false,
      isSuccess: true,
    });
    expect(screen.getByTestId("deploy-ad-insights-card")).toBeInTheDocument();
  });
});
