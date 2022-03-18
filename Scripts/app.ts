// IIFE -- Immediately Invoked Function Expression
// AKA Anonymous Self-Executing Function
(function()
{
    
    function AuthGuard(): void{
        let protected_routes: string[] = [
            "contact-list"
        ];
    
        if(protected_routes.indexOf(router.ActiveLink) > -1)
        {
            // if user does not exist in session storage
            if(!sessionStorage.getItem("user"))
            {
                // change active link to login, if not in session
                router.ActiveLink = "login";
            }
        }
    }

    function LoadLink(link: string, data: string =""): void
    {
        router.ActiveLink = link;

        AuthGuard();

        router.LinkData = data;

        history.pushState({}, "", router.ActiveLink)

        // capitalize the active link and set the document title to it

        document.title = router.ActiveLink.substring(0, 1).toUpperCase() + router.ActiveLink.substring(1);

        // remove all active Nav Links
        $("ul>li>a").each(function()
        {
            $(this).removeClass("active");
        })

            
            
        $(`li>a:contains(${document.title})`).addClass("active"); // add a class of 'active'

        LoadContent();


    }

    function AddNavigationEvents(): void
    {
        let navLinks = $("ul>li>a"); // find all navigation links

        navLinks.off("click");
        navLinks.off("mouseover");

        // loop through each Navigation link and load appropriate content on click
        navLinks.on("click", function(){

            LoadLink($(this).attr("data") as string);
        });
        // cursors change when hover over navlinks to appear like links
        navLinks.on("mouseover", function(){
            $(this).css('cursor','pointer');
        });
    }

    function AddLinkEvents(link: string): void{

        let linkQuery = $(`a.link[data=${link}]`);


        //Remove all link events
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        // add css for link aesthetic
        linkQuery.css("test-decoration", "underline");
        linkQuery.css("colour", "blue");


        // add link events
        linkQuery.on("click", function()
        {
            LoadLink(`${link}`);
        });

        linkQuery.on("mouseover", function()
        {
            $(this).css('cursor', 'pointer');
            $(this).css('font-weight', 'bold');
        });

        linkQuery.on("mouseout", function()
        {
            
            $(this).css('font-weight', 'normal');
        });


    }

    /**
     * This function loads the NavBar from the header file and injects it into the page
     *@returns {void}
     */
    function LoadHeader(): void
    {
        $.get("./Views/components/header.html", function(html_data)
        {
            $("header").html(html_data); // data payload

            // Capitalize the active link and then set the doucment title to the new string
            AddNavigationEvents();

            CheckLogin();
        });
    }
    /**
     *@returns{void}
     *
     */
    function LoadContent(): void
    {
        let page_name = router.ActiveLink; // alias 
        let callback = ActiveLinkCallBack(); // returns a reference to the appropriate function
        $.get(`./Views/content/${page_name}.html`, function(html_data)
        {
            $("main").html(html_data); // data payload

            CheckLogin();

            callback();
        });
    }

    /**
     *@returns {void}
     *
     */
    function LoadFooter(): void
    {
        $.get("./Views/components/footer.html", function(html_data)
        {
            $("footer").html(html_data); // data payload
        });
    }


    function DisplayAboutPage(): void
    {
        console.log("About Us Page");
    }

    function DisplayProductsPage(): void
    {
        console.log("Products Page");
    }

    function DisplayServicesPage(): void
    {
        console.log("Services Page");
    }


    function DisplayHomePage(): void
    {
        console.log("Home Page");

        $("#AboutUsButton").on("click", function()
        {
            LoadLink("about");
            
        });

        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`);
        //Article.innerHTML = ArticleParagraph;
        $("main").append(`<article>
        <p id="ArticleParagraph" class="mt-3">This is the Article Paragraph</p>
        </article>`);
    }

    /**
     * Adds a Contact Object to localStorage
     *
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */
    function AddContact(fullName:string, contactNumber:string, emailAddress:string)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0, 1) + Date.now();

            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    /**
     * This method validates an input text field in the form and displays
     * an error in the message area div element
     *
     * @param {string} input_field_ID
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
    function ValidateField(input_field_ID: string, regular_expression: RegExp, error_message: string)
    {
        let messageArea = $("#messageArea").hide();

        $("#" + input_field_ID).on("blur", function()
        {
            let input_text_field = $(this).val() as string; 
            if(!regular_expression.test(input_text_field)) 
            {
                $(this).trigger("focus").trigger("select"); 
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else 
            {
                messageArea.removeAttr("class").hide();
            } 
        });
    }

    /**
     * This method validation using RegEX the input fields for name,number,email form.
     * @returns {void}
     */
    function ContactFormValidation(): void
    {
        ValidateField("fullName",/^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,25})+(\s|,|-)([A-Z][a-z]{1,25})+(\s|,|-)*$/,"Please enter a valid Full Name. This must include at least a Capitalized first name followed by a Capitalized last Name.");
        ValidateField("contactNumber",/^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}$/,"Please enter a valid Contact Number. Example: (905) 555-5555");
        ValidateField("emailAddress",/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,"Please enter a valid Email Address.");
    }

    function DisplayContactPage(): void
    {
        console.log("Contact Us Page");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click",function() 
        {
            LoadLink("contact-list");
        });

        ContactFormValidation();
        
        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function(event)
        {
            //event.preventDefault();

            let fullName = document.forms[0].fullName.value as string;

            let contactNumber = document.forms[0].contactNumber.value as string;

            let emailAddress = document.forms[0].emailAddress.value as string;

            if(subscribeCheckbox.checked)
            {
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }

    function DisplayContactListPage(): void
    {

        console.log("Contact-List Page");

        if(localStorage.length > 0) // check if localStorage has something in it 
        {
            let contactList = document.getElementById("contactList") as HTMLElement;

            let data = "";

            let keys = Object.keys(localStorage);

            let index = 1;

            //for every key in the keys collection loop
            for(const key of keys)
            {
                let contactData = localStorage.getItem(key) as string; // retrieve contact data from localStorage

                let contact = new core.Contact(); // create an empty Contact Object
                contact.deserialize(contactData);

                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>
                `;

                
                
                index++;
            }

            contactList.innerHTML = data;

            
            $("button.delete").on("click", function()
            {
                if(confirm("Are you sure?"))
                {
                    localStorage.removeItem($(this).val() as string);
                }
                LoadLink("contact-list");
                
            });

            $("button.edit").on("click", function() 
            {
                
                LoadLink("edit", $(this).val() as string );
            });
        }

        $("#addButton").on("click", () =>
            {
                LoadLink("edit", "add");
        });

    }

    function DisplayEditPage(): void
    {
        console.log("Edit Page");

        ContactFormValidation();

        let page = router.LinkData;

        switch(page)
        {
            case "add":
                {
                    $("main>h1").text("Add Contact");

                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);

                    $("#editButton").on("click", (event) => 
                    {
                        event.preventDefault();
                        // Add Contact

                        let fullName = document.forms[0].fullName.value as string;

                        let contactNumber = document.forms[0].contactNumber.value as string;

                        let emailAddress = document.forms[0].emailAddress.value as string;
                        AddContact(fullName, contactNumber, emailAddress);
                        // Refresh the contact-list page
                        LoadLink("contact-list");
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    });

                }
                break;
            default:
                {
                    // get the contact info from localStorage
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page) as string);

                    // display the contact info in the edit form
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    // when Edit is pressed - update the contact
                    $("#editButton").on("click", (event)=>
                    {
                        event.preventDefault();

                        // get any changes from the form
                        contact.FullName = $("#fullName").val() as string;
                        contact.ContactNumber = $("#contactNumber").val() as string;
                        contact.EmailAddress = $("#emailAddress").val() as string;

                        // replace the item in localStorage
                        localStorage.setItem(page, contact.serialize() as string);

                        // return to the contact-list
                        LoadLink("contact-list");
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    });
                    
                }
                break;
        }
    }

    function CheckLogin(): void
    {
        // if user is logged in
        if(sessionStorage.getItem("user"))
        {
            // swap out the login link for the logout link
            $("#login").html(
                `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
            );

            $("#logout").on("click", function()
            {
                // perform logout
                sessionStorage.clear();

                // swap out the logout link for the login link
                    $("#login").html(
                        `<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`
                    );

                // redirect back to login
                LoadLink("login");
            });
        }
    }

    function DisplayLoginPage(): void
    {
        console.log("Login Page");

        let messageArea = $("#messageArea");
        messageArea.hide();

        AddLinkEvents("register");


        $("#loginButton").on("click", function()
        {
            let success = false;

            // create an empty User object
            let newUser = new core.User();

            // use jQuery shortcut to load the users.json file
            $.get("./Data/users.json", function(data)
            { 
                // for everry user in the users.json file, loop
                for (const user of data.users) 
                {
                    let username = document.forms[0].username.value as string;

                    let password = document.forms[0].password.value as string;

                   
                    // check if the username and password entered match with user
                    if(username == user.Username && password == user.Password)
                    {
                        // get the user data from the file and assign it to our empty user object
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                 // if username and password matches - success...perform the login sequence
                if(success)
                {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize() as string);

                    // hide any error messages
                    messageArea.removeAttr("class").hide();

                    // redirect the user to the secure area of our site - contact-list
                   
                    LoadLink("contact-list");
                }
                else
                {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information.").show();
                }
            });

           

            $("#cancelButtton").on("click", function()
            {
                // clear the login form
                document.forms[0].reset();

                // return to  the home page
                LoadLink("home");
            });
        });
    }

    

    function DisplayRegisterPage(): void
    {
        console.log("Register Page");

        AddLinkEvents("login");
    }

    function Display404Page(): void
    {

    }

    /**
     * This function returns the Callback function related to active link
     *
     * @returns {function}
     */
    function ActiveLinkCallBack(): Function
    {
        switch(router.ActiveLink)
        {
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "products": return DisplayProductsPage;
            case "services": return DisplayServicesPage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "edit": return DisplayEditPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "404": return Display404Page;
            default:
                console.error("ERROR: callback does not exist: " + router.ActiveLink);
                return new Function();
        }
    }

    // named function
    function Start(): void
    {
        console.log("App Started!!");

        LoadHeader();

        // AjaxRequest("GET", "./Views/components/header.html", LoadHeader);

        LoadLink("home");
        
        LoadFooter();
    }

    window.addEventListener("load", Start);

})();