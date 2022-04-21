import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          header: {
            home: "Home",
            about: "About",
            my_profile: "My profile",
            search_cooks: "Search Cooks",
            top_cooks: "Top/Feature Cooks",
            cooks_listing: "Cooks Listing",
            contact_us: "Contact us",
            dashboard: "Dashboard",
            sidemenu: {
              messages: "Messages",
              my_profile: "My profile",
              logout: "Logout"
            }
          },
          home: {
            find: "Find",
            cooks: "Cooks",
            and: "and",
            chefs: "Chefs",
            near: "near",
            you: "you",
            for_all_occassions: "for all occassions",
            steps_to_book: "Steps to book",
            search_cook_or_chef: "Search cook or chef",
            message_and_book: "Message and book",
            have_a_good_time: "Have a good time",
            home_step_one: "Search cooks or chefs nearby your location, diet preference and rate.",
            home_step_two: "Message and book anyone that you want to wish.",
            home_step_three: "Relish restaurant-quality food hot and fresh. Relax and enjoy with everyone.",
            chefs_and_cooks: "chefs and cooks",
            featured: "Featured",
            top: "Top",
            testimonials: "Testimonials"
          },
          form: {
            select: "Select your city",
            diet_prefrences: "Diet Preferences",
            "min/hr": "Min/hr",
            "max/hr": "Маx/hr",
            find: "Find",
          },
          footer: {
            title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            links: "Links",
            home: "Home",
            about: "About",
            help: "Help",
            contact: "Contact Us",
            call: "Call",
            week: "Monday - Saturday (9:00Am to 7:00PM)",
            connect: "Connect with us",
            copyright: "Copyright 2022 website.co | All rights reserved",
            privacy: "Privacy policy",
            terms: "Terms & Conditions",
          },
          about: {
            title: "About us",
            title2: "Who Are We?",
            desc: "Book your Cook is a unique platform that lets you book professional cooks and chefs for occasions like birthdays, kitty parties, house parties, family dinners and lunches. We do a spectrum of cuisines ranging from Chinese, Continental, Italian and more.",
            title3: "Our Vision",
            tagline : "When it’s about food, we don’t want you to compromise on:",
            tagline2: "Hygiene . Taste . Quantity . Comfort . Cost",
            desc2: "38% restaurants follow unhealthy practices like using expired groceries, serving unused food and maintaining unhygienic conditions in kitchens. Moreover, you spend at least 6 times the cost of food when ordering a mission to provide hygienic, cost effective and a fantastic dining experience within the comfort of your home.",
            desc3: "Book your Cook comes to your rescue! We are on a mission to provide hygienic, cost effective and a fantastic dining experience within the comfort of your home.",
            title4: "Foodies Love Us",
            title5: "A Unique Concept",
            desc4: "So convenient! I was relaxed and could easily spend time with my friends. No kitchen worries. The chefs professionally handled my kitchen.",
            author1: "Shruti Malhotra 08 Sep 2019",
            title6: "Amazing Experience",
            desc5: "Hired a Chef for our party and it was the best decision ever during these pandemic times. So professional. Everyone must try them for sure. Great job, COOKS.",
            author2: "Estelle Leonard",
            title7: "Highly Recommended",
            desc6: "Food quantity, presentation and taste was on point. All guests were overwhelmed. Ingredients quantity was perfect. Absolutely brilliant!",
            author3: "Anuj Agarwal 29 Mar 2021",
            button: "Read More Reviews",
            title8: "Experienced Cooks & Chefs."
          },
          cooklist: {
            search_results: "Search Results",
            view: "View",
            filter: "filter",
            filters: "Filters",
            clear_filter: "Clear filters",
            search_by_city: "Search by city",
            distance: "Distance(in Miles.)",
            rate: "Hourly rate",
            min: "Min",
            max: "Max",
            diet: "Diet Preferences",
            all: "All",
            any: "Any",
            meal: "Meal Type",
            cuisine: "Cuisine Preferences",
            profession: "Profession",
            chef: "Chef",
            cook: "Cook",
            language: "Languages",
            ratings: "Ratings",
            up: "up",
            items_found: "items found",
            sort_by: "Sort by",
            price: "Price",
            lowtohigh: "Low to High",
            hightolow: "High to low",
            away: "away",
            speciality: "Speciality",
            no_min: "No minimum price"
          },
          contact:{
            title: "Contact us",
            name: "Name",
            enter_name: "Enter name",
            email: "Email",
            enter_email: "Enter email",
            subject: "Subject",
            enter_subject: "Enter subject",
            message: "Message",
            enter_message: "Enter message",
            validation1: "Name is required",
            validation2: "Enter a valid name",
            validation3: "Email is required",
            validation4: "Enter a valid email",
            validation5: "Subject is required",
            validation6: "Enter a valid subject",
            validation7: "Message is required",
            validation8: "Enter a correct message",
            success: "Details sent successfully",
            submit: "Submit"
          },
          login:{
            login: "Login",
            email: "Email Address",
            password: "Password",
            validation1: "Email is required",
            validation2: "Email is not valid",
            validation3: "Password is required",
            validation4: "Password should be at-least 6 characters",
            account: "Don't have an account yet? ",
            forgot: "Forgot Password",
            signup: "Sign up"
          },
          signup:{
            signup: "Sign up",
            firstname: "First name",
            lastname: "Last name",
            account: "Account type",
            user: "User",
            cook:"Cook",
            email: "Email address",
            password: "Password",
            validation1:"First name is required",
            validation2: "Last name is required",
            validation3: "Account type is required",
            validation4: "Email is required",
            validation5: "Email is not valid",
            validation6: "Password is required",
            validation7: "Password should be at-least 6 characters",
            already_account: "Already have an account? ",
          },
          dashboard:{
            my_recipes: "My Recipes",
            no_recipes: "No recipes to show",
            hour: "hr",
            min: "min",
            view_profile: "View profile",
            items: "items",
            add_new: "Add New",
            delete_modal: "Do you want to delete this recipe?",
            delete: "Delete",
            cancel: "Cancel",
          },
          cook_profile:{
            upload_cover: "Upload Cover",
            recipes: "Recipes",
            speciality: "Speciality",
            ratings: "Ratings",
            edit:"Edit",
            languages_known: "Languages known",
            no_diet: "No diet preferences found!",
            no_language: "No language found!",
            no_profession: "No profession found!",
            best: "Best",
            add_new: "Add new recipe",
            no_speciality: "No speciality found!",
            no_cuisine: "No cuisine preferences found!",
            no_meal: "No meal type found!",
            reviews: "review(s)",
            overall_rating: "Overall Rating",
            communication: "Comunication",
            presentation: "Presentation",
            taste: "Taste",
            punctuality: "Punctuality",
            cleanliness: "Cleanliness",
            value: "Value",
            no_review: "No review found!",
            reply: "Reply",
            add_review: "Add Review",
            reply2: "Reply to the above review here",
            validation: "This field is required.",
            post: "Post",
            ingredients: "Ingredients",
            no_recipe: "No recipe found!",
            click: "Click for more details",
            delete: "Do you want to delete this reply?",
            no_user: "No User",
            write: "Write a review",
            rate: "Rate is required",
            title_required: "Title is required",
            share_details: "Share details of your experience",
            description_required: "Description is required",
            edit_review: "Edit Review",
            title: "Title",
            send_message: "Send Message",
            message_required: "Message is required"
          },
          add_recipe: {
            add_new_recipe: "Add New Recipe",
            name: "Recipe name",
            desc: "Recipe description",
            validation1: "Name is required",
            validation2: "Enter any valid title",
            validation3: "Description is required",
            validation4: "Enter valid description",
            time: "Recipe Time",
            hour: "Enter hours",
            validation5: "Enter the time(in hrs)",
            min: "Enter minutes",
            validation6: "Enter the time(in mins)",
            add_more: "Add more",
            validation7: "Enter some ingredients",
            validation8: "Select any dietary preference",
            best_recipe: "Check, if this is your best recipe?",
            updated: "Your profile has been updated",
            next: "Next",
            add_image: "Add recipe images",
            submit: "Submit",
            new_ingredient: "Enter new ingredient",
            add: "Add",
            new_diet: "Enter new dietery preference",
            new_meal: "Enter new meal type",
            new_cuisine: "Enter new Cuisine Preference"
          },
          update_recipe: {
            title: "Update Recipe",
            save: "Save"
          },
          recipe_detail: {
            by: "By",
            why_recipe: "WHY THIS RECIPE WORKS",
            ingredients: "INGREDIENTS",
            time: "Time",
            category: "Recipe category",
            hrs: "hrs",
            mins: "mins"
          },
          conversations: {
            messages: "Messages",
            no_user: "No user found!",
            unread: "Unread",
            no_chat: "No chat found!",
            send: "Send"
          },
          preferences: {
            title: "Preferences",
            min_price: "Min cook price/hr",
            updated: "Your profile has been updated",
            save: "Save",
            enter_speciality: "Enter any speciality",
            add: "Add",
            enter_language: "Enter new language",
            enter_diet: "Enter new dietery preference",
            enter_meal: "Enter new Meal type",
            enter_cuisine: "Enter new Cuisine Preference"
          },
          profile: {
            title: "Account details",
            verified: "Verified",
            country: "Country",
            select_country:"Select country",
            state: "State",
            select_state: "Select State",
            location: "Location",
            address: "Address",
            enter_address: "Enter Address",
            zipcode: "Zip code",
            enter_zipcode: "Enter zip code",
            about_you: "About you",
            about: "Type something about you, experience, hobbies etc...",
            update_password: "Update Password",
            current_password: "Current password",
            new_password: "New password",
            confirm_password: "Confirm new password",
            validation1: "Enter your old password",
            validation2: "Enter new password",
            validation3: "Password should be at-least 6 characters",
            validation4: "The passwords do not match",
            validation5: "Enter the password again",
            updated_password: "Your password has been updated"
          },
          forgot_password: {
            title: "Forgot Password",
            send_link: "Send Link",
            validation1:"Please check your email"
          },
          reset_password:{
            title: "Reset Password",
            validation: "This field is required"
          },
          terms: {
            title: "Terms and Conditions"
          },
          privacy: {
            title: "Privacy Policy"
          }
        }
      },
      // Russian
      ru: {
        translation: {
          header: {
            home: "Главная",
            about: "O нас",
            my_profile: "Мой профиль",
            top_cooks: "Лучшие повара",
            search_cooks: "Поиск поваров",
            cooks_listing: "Список поваров",
            contact_us: "Контакты",
            dashboard: "Мои рецепты",
            sidemenu: {
              messages: "Сообщения",
              my_profile: "Мой профайл",
              logout: "Выйти"
            }
          },
          home: {
            find: "Найди",
            cooks: "Лучшего",
            and: "повара",
            chefs: "рядом",
            near: "с",
            you: "тобой",
            for_all_occassions: "на все случаи жизни",
            steps_to_book: "Шаги для бронирования",
            search_cook_or_chef: "Поиск повара или шеф-повара",
            message_and_book: "Отправь сообщение и забронируй",
            have_a_good_time: "Отдыхай и наслаждайся",
            home_step_one: "Воспользуйся поиском, чтобы найти повара или шеф-повара, в зависимости от твоих вкусовых предпочтений, аллергических реакций, повода, месторасположения и бюджета.",
            home_step_two: "Задай подходящему повару вопросы и договорись о встрече.",
            home_step_three: "Свежие блюда ресторанного качества будут долго радовать каждого члена семьи. Но при этом никому не придется тратить долгие часы на их приготовление.",
            chefs_and_cooks: "повара",
            featured: "Набирающие популярность",
            top: "с наиболее высоким рейтингом"
          },
          form: {
            select: "Выберите свой город",
            diet_prefrences: "Диетические предпочтения",
            "min/hr": "Мин/час",
            "max/hr": "Макс/час",
            find: "Находить",
          },
          footer: {
            title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            links: "Links",
            home: "Главная",
            about: "O нас",
            help: "Help",
            contact: "Контакты",
            call: "Call",
            week: "Monday - Saturday (9:00Am to 7:00PM)",
            connect: "Connect with us",
            copyright: "Copyright 2022 website.co | All rights reserved",
            privacy: "Privacy policy",
            terms: "Terms & Conditions",
          },
          about: {
            title: "About us",
            title2: "Who Are We?",
            desc: "Book your Cook is a unique platform that lets you book professional cooks and chefs for occasions like birthdays, kitty parties, house parties, family dinners and lunches. We do a spectrum of cuisines ranging from Chinese, Continental, Italian and more.",
            title3: "Our Vision",
            tagline : "When it’s about food, we don’t want you to compromise on:",
            tagline2: "Hygiene . Taste . Quantity . Comfort . Cost",
            desc2: "38% restaurants follow unhealthy practices like using expired groceries, serving unused food and maintaining unhygienic conditions in kitchens. Moreover, you spend at least 6 times the cost of food when ordering a mission to provide hygienic, cost effective and a fantastic dining experience within the comfort of your home.",
            desc3: "Book your Cook comes to your rescue! We are on a mission to provide hygienic, cost effective and a fantastic dining experience within the comfort of your home.",
            title4: "Foodies Love Us",
            title5: "A Unique Concept",
            desc4: "So convenient! I was relaxed and could easily spend time with my friends. No kitchen worries. The chefs professionally handled my kitchen.",
            author1: "Shruti Malhotra 08 Sep 2019",
            title6: "Amazing Experience",
            desc5: "Hired a Chef for our party and it was the best decision ever during these pandemic times. So professional. Everyone must try them for sure. Great job, COOKS.",
            author2: "Estelle Leonard",
            title7: "Highly Recommended",
            desc6: "Food quantity, presentation and taste was on point. All guests were overwhelmed. Ingredients quantity was perfect. Absolutely brilliant!",
            author3: "Anuj Agarwal 29 Mar 2021",
            button: "Read More Reviews",
            title8: "Experienced Cooks & Chefs."
          },
          cooklist: {
            search_results: "Search Results",
            view: "View",
            filter: "filter",
            filters: "Filters",
            clear_filter: "Clear filters",
            search_by_city: "Search by city",
            distance: "Distance(in Miles.)",
            rate: "Hourly rate",
            min: "Min",
            max: "Max",
            diet: "Diet Preferences",
            all: "All",
            any: "Any",
            meal: "Meal Types",
            cuisine: "Cuisine Preferences",
            profession: "Profession",
            chef: "Chef",
            cook: "Cook",
            language: "Languages",
            ratings: "Ratings",
            up: "up",
            items_found: "items found",
            sort_by: "Sort by",
            price: "Price",
            lowtohigh: "Low to High",
            hightolow: "High to low",
            away: "away",
            speciality: "Speciality",
            no_min: "No minimum price"
          },
          contact:{
            title: "Контакты",
            name: "Name",
            enter_name: "Enter name",
            email: "Email",
            enter_email: "Enter email",
            subject: "Subject",
            enter_subject: "Enter subject",
            message: "Message",
            enter_message: "Enter message",
            validation1: "Name is required",
            validation2: "Enter a valid name",
            validation3: "Email is required",
            validation4: "Enter a valid email",
            validation5: "Subject is required",
            validation6: "Enter a valid subject",
            validation7: "Message is required",
            validation8: "Enter a correct message",
            success: "Details sent successfully",
            submit: "Submit"
          },
          login:{
            login: "Login",
            email: "Email Address",
            password: "Password",
            validation1: "Email is required",
            validation2: "Email is not valid",
            validation3: "Password is required",
            validation4: "Password should be at-least 6 characters",
            account: "Don't have an account yet? ",
            forgot: "Forgot Password",
            signup: "Sign up"
          },
          signup:{
            signup: "Sign up",
            firstname: "First name",
            lastname: "Last name",
            account: "Account type",
            user: "User",
            cook:"Cook",
            email: "Email address",
            password: "Password",
            validation1:"First name is required",
            validation2: "Last name is required",
            validation3: "Account type is required",
            validation4: "Email is required",
            validation5: "Email is not valid",
            validation6: "Password is required",
            validation7: "Password should be at-least 6 characters",
            already_account: "Already have an account? ",
          },
          dashboard:{
            my_recipes: "My Recipes",
            no_recipes: "No recipes to show",
            hour: "hr",
            min: "min",
            view_profile: "View profile",
            items: "items",
            add_new: "Add New",
            delete_modal: "Do you want to delete this recipe?",
            delete: "Delete",
            cancel: "Cancel"
          },
          cook_profile:{
            upload_cover: "Upload Cover",
            recipes: "Recipes",
            speciality: "Speciality",
            ratings: "Ratings",
            edit:"Edit",
            languages_known: "Languages known",
            no_diet: "No diet preferences found!",
            no_language: "No language found!",
            no_profession: "No profession found!",
            best: "Best",
            add_new: "Add new recipe",
            no_speciality: "No speciality found!",
            no_cuisine: "No cuisine preferences found!",
            no_meal: "No meal type found!",
            reviews: "review(s)",
            overall_rating: "Overall Rating",
            communication: "Comunication",
            presentation: "Presentation",
            taste: "Taste",
            punctuality: "Punctuality",
            cleanliness: "Cleanliness",
            value: "Value",
            no_review: "No review found!",
            reply: "Reply",
            add_review: "Add Review",
            reply2: "Reply to the above review here",
            validation: "This field is required.",
            post: "Post",
            ingredients: "Ingredients",
            no_recipe: "No recipe found!",
            click: "Click for more details",
            delete: "Do you want to delete this reply?",
            no_user: "No User",
            write: "Write a review",
            rate: "Rate is required",
            title_required: "Title is required",
            share_details: "Share details of your experience",
            description_required: "Description is required",
            edit_review: "Edit Review",
            title: "Title",
            send_message: "Send Message",
            message_required: "Message is required"
          },
          add_recipe: {
            add_new_recipe: "Add New Recipe",
            name: "Recipe name",
            desc: "Recipe decription",
            validation1: "Name is required",
            validation2: "Enter any valid title",
            validation3: "Description is required",
            validation4: "Enter valid description",
            time: "Recipe Time",
            hour: "Enter hours",
            validation5: "Enter the time(in hrs)",
            min: "Enter minutes",
            validation6: "Enter the time(in mins)",
            add_more: "Add more",
            validation7: "Enter some ingredients",
            validation8: "Select any dietary preference",
            best_recipe: "Check, if this is your best recipe?",
            updated: "Your profile has been updated",
            next: "Next",
            add_image: "Add recipe images",
            submit: "Submit",
            new_ingredient: "Enter new ingredient",
            add: "Add",
            new_diet: "Enter new dietery preference",
            new_meal: "Enter new meal type",
            new_cuisine: "Enter new Cuisine Preference"
          },
          update_recipe: {
            title: "Update Recipe",
            save: "Save"
          },
          recipe_detail: {
            by: "By",
            why_recipe: "WHY THIS RECIPE WORKS",
            ingredients: "INGREDIENTS",
            time: "Time",
            category: "Recipe category",
            hrs: "hrs",
            mins: "mins"
          },
          conversations: {
            messages: "Messages",
            no_user: "No user found!",
            unread: "Unread",
            no_chat: "No chat found!",
            send: "Send"
          },
          preferences: {
            title: "Preferences",
            min_price: "Min cook price/hr",
            updated: "Your profile has been updated",
            save: "Save",
            enter_speciality: "Enter any speciality",
            add: "Add",
            enter_language: "Enter new language",
            enter_diet: "Enter new dietery preference",
            enter_meal: "Enter new Meal type",
            enter_cuisine: "Enter new Cuisine Preference"
          },
          profile: {
            title: "Account details",
            verified: "Verified",
            country: "Country",
            select_country:"Select country",
            state: "State",
            select_state: "Select State",
            location: "Location",
            address: "Address",
            enter_address: "Enter Address",
            zipcode: "Zip code",
            enter_zipcode: "Enter zip code",
            about_you: "About you",
            about: "Type something about you, experience, hobbies etc...",
            update_password: "Update Password",
            current_password: "Current password",
            new_password: "New password",
            confirm_password: "Confirm new password",
            validation1: "Enter your old password",
            validation2: "Enter new password",
            validation3: "Password should be at-least 6 characters",
            validation4: "The passwords do not match",
            validation5: "Enter the password again",
            updated_password: "Your password has been updated"
          },
          forgot_password: {
            title: "Forgot Password",
            send_link: "Send Link",
            validation1:"Please check your email"
          },
          reset_password:{
            title: "Reset Password",
            validation: "This field is required"
          },
          terms: {
            title: "Terms and Conditions"
          },
          privacy: {
            title: "Privacy Policy"
          }
        }
      }
    }
  });

export default i18n;