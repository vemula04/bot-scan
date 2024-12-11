var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
require("../config/db");
// const tenantModel = require("../model/tenant");
const Tenant = require("../models/tenant");
const Token = require("../models/token");
const auth = require("../middleware/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const config = require("../config/config");
const Artifact = require("../models/artifact");
const moment = require("moment");
const Roles = require("../models/roles");
const Utilities = require("../utils/utils");
const TenantAddress = require("../models/tenantaddress");
const emailTempaltes = require("../config/emailtemplate");
const Item = require("../models/item");

/* GET home page. */
const saveTenantAddress = async (address, created_by, tenant_id, contact) => {
  console.log(`SaveTenant Address :: contact::`, contact);
  return await new TenantAddress({
    tenant_id: tenant_id,
    address: address.address,
    country: address.country,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    created_by: created_by,
    created_on: moment().format(),
    contact: contact,
  }).save();
};
router.post("/onboard", async (req, res) => {
  console.log(req.body);

  const {
    name,
    url,
    primary_color,
    secondary_color,
    email,
    address,
    country,
    city,
    state,
    postalCode,
    created_by,
    business_url,
    contact,
    displayName
  } = req.body;
  const { updated_by } = {
    updated_by: "3242345",
  };

  try {
    // address: "",
    // country: "",
    // city: "",
    // state: "",
    // postalCode: "",
    const tenant = new Tenant({
      name: name,
      url: url,
      primary_color: primary_color,
      secondary_color: secondary_color,
      email: email,
      created_by: created_by,
      created_on: moment().format(),
      business_url: business_url,
      display_name: displayName
    });
    const query = {
      $or: [
        { email: email },
        { name: name }
      ]
    };
    const fn_tnt = await Tenant.findOne(query);

    if (!fn_tnt) {
      await tenant
        .save()
        .then(async (data) => {
          console.log("Tenant Onbaroded Successfully");
        })
        .catch((err) => console.log(err));
      if (tenant) {
        const tmp_pwd = crypto.randomBytes(10).toString("hex");
        //fetch tenant role...
        const role = await Roles.findOne({ name: "tenant" });
        //save the token of a tenant...
        const token = await new Token({
          tenant_id: tenant._id.toString(),
          // token: crypto.randomBytes(255).toString("hex"), // for demo
          token: tmp_pwd,
          email: email,
          role_id: role._id,
        }).save();
        //address save...
        const tAddress = await saveTenantAddress(
          { address, country, city, state, postalCode },
          created_by,
          tenant._id,
          contact
        );
        //email template...
        if (token && tAddress) {
          // const message = `${config.BASE_URI}/verify/${tenant._id}/${token.token}`; commented for demo
          const message = `
                    <html xmlns="http://www.w3.org/1999/xhtml">
                        <head>
                            <meta http-equiv="content-type" content="text/html; charset=utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0;">
                            <meta name="format-detection" content="telephone=no"/>

                            <!-- Responsive Mobile-First Email Template by Konstantin Savchenko, 2015.
                            https://github.com/konsav/email-templates/  -->

                            <style>
                        /* Reset styles */ 
                        body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
                        body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
                        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
                        img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                        #outlook a { padding: 0; }
                        .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
                        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }

                        /* Rounded corners for advanced mail clients only */ 
                        @media all and (min-width: 560px) {
                            .container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}
                        }

                        /* Set color for auto links (addresses, dates, etc.) */ 
                        a, a:hover {
                            color: #127DB3;
                        }
                        .footer a, .footer a:hover {
                            color: #999999;
                        }

                            </style>

                            <!-- MESSAGE SUBJECT -->
                            <title>Get this responsive email template</title>

                        </head>

                        <!-- BODY -->
                        <!-- Set message background color (twice) and text color (twice) -->
                        <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
                            background-color: #F0F0F0;
                            color: #000000;"
                            bgcolor="#F0F0F0"
                            text="#000000">

                        <!-- SECTION / BACKGROUND -->
                        <!-- Set message background color one again -->
                        <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
                            bgcolor="#F0F0F0">

                        <!-- WRAPPER -->
                        <!-- Set wrapper width (twice) -->
                        <table border="0" cellpadding="0" cellspacing="0" align="center"
                            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                            max-width: 560px;" class="wrapper">

                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 20px;
                                    padding-bottom: 20px;">

                                    <!-- PREHEADER -->
                                    <!-- Set text color to background color -->
                                    <div style="display: none; visibility: hidden; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; height: 0; max-height: 0; max-width: 0;
                                    color: #F0F0F0;" class="preheader">
                                        Available on&nbsp;GitHub and&nbsp;CodePen. Highly compatible. Designer friendly. More than 50%&nbsp;of&nbsp;total email opens occurred on&nbsp;a&nbsp;mobile device&nbsp;— a&nbsp;mobile-friendly design is&nbsp;a&nbsp;must for&nbsp;email campaigns.</div>

                                    <!-- LOGO -->
                                    <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2. URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content=logo&utm_campaign={{Campaign-Name}} -->
                                    <a target="_blank" style="text-decoration: none;"
                                        href="https://github.com/konsav/email-templates/"><img border="0" vspace="0" hspace="0"
                                        src="https://raw.githubusercontent.com/konsav/email-templates/master/images/logo-black.png"
                                        width="100" height="30"
                                        alt="Logo" title="Logo" style="
                                        color: #000000;
                                        font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" /></a>

                                </td>
                            </tr>

                        <!-- End of WRAPPER -->
                        </table>

                        <!-- WRAPPER / CONTEINER -->
                        <!-- Set conteiner background color -->
                        <table border="0" cellpadding="0" cellspacing="0" align="center"
                            bgcolor="#FFFFFF"
                            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                            max-width: 560px;" class="container">

                            <!-- HEADER -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
                                    padding-top: 25px;
                                    color: #000000;
                                    font-family: sans-serif;" class="header">
                                        Steal Deals Application
                                </td>
                            </tr>
                            
                            <!-- SUBHEADER -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
                            <!-- <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-bottom: 3px; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 18px; font-weight: 300; line-height: 150%;
                                    padding-top: 5px;
                                    color: #000000;
                                    font-family: sans-serif;" class="subheader">
                                        Works for&nbsp;All Devices
                                </td>
                            </tr>
                            -->

                            <!-- HERO IMAGE -->
                            <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                                    padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
                                    href="javascript:void(0);"><img border="0" vspace="0" hspace="0"
                                    src="https://www.frost.com/wp-content/uploads/2023/01/Picture4-scaled.jpg"
                                    alt="Please enable images to view this content" title="Hero Image"
                                    width="560" style="
                                    width: 100%;
                                    max-width: 560px;
                                    color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
                            </tr>

                            <!-- PARAGRAPH -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                            <!--<tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                                    padding-top: 25px; 
                                    color: #000000;
                                    font-family: sans-serif;" class="paragraph">
                                        More than 50%&nbsp;of&nbsp;total email opens occurred on&nbsp;a&nbsp;mobile device&nbsp;— a&nbsp;mobile-friendly design is&nbsp;a&nbsp;must for&nbsp;email campaigns.
                                </td>
                            </tr> -->
                            <!-- BUTTON -->
                            <!-- Set button background color at TD, link/text color at A and TD, font family ("sans-serif" or "Georgia, serif") at TD. For verification codes add "letter-spacing: 5px;". Link format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Button-Name}}&utm_campaign={{Campaign-Name}} -->
                            <!--
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 25px;
                                    padding-bottom: 5px;" class="button"><a
                                    href="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration: underline;">
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
                                            bgcolor="#E9703E"><a target="_blank" style="text-decoration: underline;
                                            color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;"
                                            href="https://github.com/konsav/email-templates/">
                                                Get the template
                                            </a>
                                    </td></tr></table></a>
                                </td>
                            </tr>
                            -->

                            <!-- LINE -->
                            <!-- Set line color -->
                            <tr>	
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 25px;" class="line"><hr
                                    color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                                </td>
                            </tr>

                            <!-- LIST -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%;" class="list-item"><table align="center" border="0" cellspacing="0" cellpadding="0" style="width: inherit; margin: 0; padding: 0; border-collapse: collapse; border-spacing: 0;">
                                    
                                    <!-- LIST ITEM -->
                                    <tr>

                                        <!-- LIST ITEM IMAGE -->
                                        <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->
                                        <td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0;
                                            padding-top: 30px;
                                            padding-right: 20px;"><img
                                        border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;
                                            color: #000000;"
                                            src="https://klr.ac.in/wp-content/uploads/2015/11/dummy-user-1-200x200.jpg"
                                            alt="H" title="Highly compatible"
                                            width="50" height="50"></td>

                                        <!-- LIST ITEM TEXT -->
                                        <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                                        <td align="left" valign="top" style="font-size: 17px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                                            padding-top: 40px;
                                            color: #000000;
                                            font-family: sans-serif;" class="paragraph">
                                                <b style="color: #333333;">${email}</b>
                                        </td>

                                    </tr>

                                    <!-- LIST ITEM -->
                                    <tr>

                                        <!-- LIST ITEM IMAGE -->
                                        <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->
                                        <td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0;
                                            padding-top: 30px;
                                            padding-right: 20px;"><img
                                        border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;
                                            color: #000000;"
                                            src="https://media.istockphoto.com/id/484906142/vector/lock-icon.jpg?s=612x612&w=0&k=20&c=sKHmmgJ4Su0qh9LPtrt2VpVKdXWdFBdUX8XOcK3aSfI="
                                            alt="D" title="Designer friendly"
                                            width="50" height="50"></td>

                                        <!-- LIST ITEM TEXT -->
                                        <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                                        <td align="left" valign="top" style="font-size: 17px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                                            padding-top: 40px;
                                            color: #000000;
                                            font-family: sans-serif;" class="paragraph">
                                                <b style="color: #333333;">${tmp_pwd}</b>
                                                <!-- <br/>
                                                Sketch app resource file and a&nbsp;bunch of&nbsp;social media icons are&nbsp;also included in&nbsp;GitHub repository.
                                                -->
                                        </td>
                                        <td style="font-size: 17px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                                                            padding-top: 40px;
                                                            color: #000000;
                                                            font-family: sans-serif;color: #127DB3;">
                                                            <a href="${config.BASE_URI}/#/${name}/tenantlogin" style="    border-radius: 15px;
                                            border: 1px solid #000;
                                            padding: 10px;
                                            background: #0c3c5b;
                                            color: #fff;
                                            text-decoration: none;"> Login </a>
                                        </td>

                                    </tr>

                                </table></td>
                            </tr>

                            <!-- LINE -->
                            <!-- Set line color -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 25px;" class="line"><hr
                                    color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                                </td>
                            </tr>

                            <!-- PARAGRAPH -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                                    padding-top: 20px;
                                    padding-bottom: 25px;
                                    color: #000000;
                                    font-family: sans-serif;" class="paragraph">
                                        Have a&nbsp;question? <a href="mailto:info@stealdeals.com.au" target="_blank" style="color: #127DB3; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 160%;">info@stealdeals.com.au</a>
                                </td>
                            </tr>

                        <!-- End of WRAPPER -->
                        </table>

                        <!-- WRAPPER -->
                        <!-- Set wrapper width (twice) -->
                        <table border="0" cellpadding="0" cellspacing="0" align="center"
                            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                            max-width: 560px;" class="wrapper">

                            <!-- SOCIAL NETWORKS -->
                            <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 25px;" class="social-icons"><table
                                    width="256" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; border-spacing: 0; padding: 0;">
                                    <tr>

                                        <!-- ICON 1 -->
                                        <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                                            href="#"
                                        style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                                            color: #000000;"
                                            alt="F" title="Facebook"
                                            width="44" height="44"
                                            src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/facebook.png"></a></td>

                                        <!-- ICON 2 -->
                                        <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                                            href="#"
                                        style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                                            color: #000000;"
                                            alt="T" title="Twitter"
                                            width="44" height="44"
                                            src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/twitter.png"></a></td>				

                                        <!-- ICON 3 -->
                                        <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                                            href="#"
                                        style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                                            color: #000000;"
                                            alt="G" title="Google Plus"
                                            width="44" height="44"
                                            src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/googleplus.png"></a></td>		

                                        <!-- ICON 4 -->
                                        <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                                            href="#"
                                        style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                                            color: #000000;"
                                            alt="I" title="Instagram"
                                            width="44" height="44"
                                            src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/instagram.png"></a></td>

                                    </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                                    padding-top: 20px;
                                    padding-bottom: 20px;
                                    color: #999999;
                                    font-family: sans-serif;" class="footer">

                                        <!-- This email template was sent to&nbsp;you becouse we&nbsp;want to&nbsp;make the&nbsp;world a&nbsp;better place. You&nbsp;could change your <a href="${config.BASE_URI}/${name}/login" target="_blank" style="text-decoration: underline; color: #999999; font-family: sans-serif; font-size: 13px; font-weight: 400; line-height: 150%;">subscription settings</a> anytime. -->

                                        <!-- ANALYTICS -->
                                        <!-- https://www.google-analytics.com/collect?v=1&tid={{UA-Tracking-ID}}&cid={{Client-ID}}&t=event&ec=email&ea=open&cs={{Campaign-Source}}&cm=email&cn={{Campaign-Name}} -->
                                        <img width="1" height="1" border="0" vspace="0" hspace="0" style="margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"
                                        src="https://raw.githubusercontent.com/konsav/email-templates/master/images/tracker.png" />

                                </td>
                            </tr>

                        <!-- End of WRAPPER -->
                        </table>

                        <!-- End of SECTION / BACKGROUND -->
                        </td></tr></table>

                        </body>
                        </html>
                    `;
          // console.log(`verification link :: ${message}`);
          await sendEmail(
            email,
            `Tenant Onbarding Credentails - ${name}`,
            "",
            message
          );
        }
        res.send({
          statusCode: 200,
          message: "Success",
        });
      }
    } else {
      res.send({ message: "Tenant already exist either with Email ID or Tenant Name", statusCode: 501 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
const axios = require("axios");

async function sendEmail_(name, email, subject, message) {
  const data = JSON.stringify({
    Messages: [
      {
        From: { Email: "karteek.v@gmail.com", Name: "Karteek" },
        To: [{ Email: email, Name: name }],
        Subject: subject,
        TextPart: message,
      },
    ],
  });

  const config = {
    method: "post",
    url: "https://api.mailjet.com/v3.1/send",
    data: data,
    headers: { "Content-Type": "application/json" },
    auth: {
      username: "f6351d11e0de8790d034964e727f04e9",
      password: "6fe08fc6b8b79f0a8e71d8cf5f909b8c",
    },
  };

  await axios.post(config.url, config.data, {
    auth: {
      username: "f6351d11e0de8790d034964e727f04e9",
      password: "6fe08fc6b8b79f0a8e71d8cf5f909b8c",
    },
  });
  // return axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
}
const nodemailer = require("nodemailer");
// Not working...
const { MailtrapClient } = require("mailtrap");

router.post("/sendmail", async (req, res, next) => {
  // await sendEmail(
  //   "karteek.v@gmail.com",
  //   `Tenant Onbarding Credentails`,
  //   "",
  //   "<p>Successfully sent</p>"
  // );
  // var transport = nodemailer.createTransport({
  //   host: "email-smtp.ap-southeast-2.amazonaws.com",
  //   secure: true,
  //   port: 465,
  //   auth: {
  //     user: "AKIAWTH4J746LX6C77OX",
  //     pass: "BO3u39XiDO6tSZnqvU40qu23fCRVmNtugRik5wJDJVlM",
  //   },
  //     secure: true
  // });

  // const message = {
  //     from: "karteek.v@gmail.com",
  //     to: "karteek.v@gmail.com",
  //     subject: "Subject",
  //     text: "Hello SMTP Email"
  // }

  // transport.sendMail(message, (err, info) => {
  //     if (err) {
  //         console.log(err)
  //     } else {
  //         console.log(info);
  //     }
  // });

  // const TOKEN = "c3020d53ff7de801c5156a92affbce30";
  // const ENDPOINT = "https://send.api.mailtrap.io/";

  // const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

  // const sender = {
  //   email: "mailtrap@medhatech.com.au",
  //   name: "Mailtrap Test",
  // };
  // const recipients = [
  //   {
  //     email: "karteek.v@gmail.com",
  //   },
  // ];

  // client
  //   .send({
  //     from: sender,
  //     to: recipients,
  //     subject: "You are awesome!",
  //     text: "Congrats for sending test email with Mailtrap!",
  //     category: "Integration Test",
  //   })
  //   .then(console.log, console.error);

  sendEmail(
    "ratna536@gmail.com",
    "Testing the live mail from scanner app...",
    "Testing",
    "<h1>Testing the live mail..</h1>"
  );
});

router.get("/verify/:id/:token", async (req, res, next) => {
  try {
    const tenant = await Tenant.findOne({ _id: req.params.id });
    if (!tenant) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      tenant_id: tenant._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);
    res.send("email verified sucessfully");
  } catch (err) {
    console.log("ERROR:: verify ::", err?.message);
    res.status(401).send({ message: err?.message });
  }
});

router.get("/getTenants", async (req, res) => {
  try {
    // Query    
    const query = {};
    const options = {
      // Sort returned documents in ascending order by title (A->Z)

      sort: { created_on: -1 },
      // Include only the `name` and `logo` fields in each returned document
      // projection: { _id: 0, name: 1, logo: 1 },
    };
    // http://localhost:3000/gettenants?offset=0&limit=10

    const { offset, limit } = req.query;
    const tenant = await Tenant.find(query, {}, options)
    // .limit(limit).skip(offset);;
    let results = [];
    tenant.forEach((value) => {
      // console.log(value);
      results.push(value);
    });
    if (tenant) {
      res
        .send({
          statusCode: 200,
          data: results,
          total: await Tenant.countDocuments({})
        })
        .status(200);
    } else {
      res
        .send({
          statusCode: 502,
          message: "No Tenants found",
        })
        .status(200);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/getTenantAddressByTenantId", async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const query = { tenant_id: tenant_id };
    const tenant_details = await TenantAddress.findOne(query);
    console.log(`tenant_details:: `, tenant_details);
    if (tenant_details) {
      res
        .send({
          statusCode: 200,
          data: tenant_details,
        })
        .status(200);
    } else {
      res.send({
        statusCode: 502,
        message: `Please check tenant Id`,
      });
    }
  } catch (err) {
    res.status(400).send(err?.message);
  }
});
router.get("/getTenantByName", async (req, res) => {
  try {
    // Query
    const { name } = req.query;
    const query = { name: name };
    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { name: -1 },
      // Include only the `name` and `logo` fields in each returned document
      projection: { _id: 0, name: 1, logo: 1 },
    };
    const tenant = await Tenant.find(query);
    // console.log(`tenant id:: `, tenant[0]._id)
    const tenant_details = await TenantAddress.findOne({
      tenant_id: tenant[0]?._id,
    });
    console.log(`tenant_details:: `, tenant_details);
    let results = [];
    tenant.forEach((value) => {
      console.log(value);
      results.push(value);
    });
    if (tenant) {
      res
        .send({
          statusCode: 200,
          data: results,
        })
        .status(200);
    } else {
      res.send({
        statusCode: 502,
        message: `Please check tenant name <${name}>`,
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
const QRCode = require("qrcode");
const { Mongoose } = require("mongoose");

router.post("/generateqrcode", async function (req, res) {
  const { tenantName, email } = req.body;
  const url = `${config.BASE_URI}/#/${tenantName}/home`;
  let img = await QRCode.toDataURL(url);
  // Define the path and filename for the output image
  const outputPath = `${tenantName}.png`; // Replace with your desired path

  QRCode.toFile(outputPath, url, async (err) => {
    if (err) {
      console.error("Error generating QR code:", err);
    } else {
      console.log(`QR code image generated successfully: ${outputPath}`);
      let mailOptions = {
        from: "", // sender address
        to: "", // list of receivers
        subject: `QR Code for Tenant - ${tenantName}`, // Subject line
        html: emailTempaltes.loadQRCodeTemplate(tenantName, url, img), // html body   ,
        attachments: [
          {
            filename: `QRCode :: ${tenantName}`,
            path: outputPath,
            contentType: "image/png",
          },
        ],
      };
      // console.log(mailOptions.html);
      const emailres = await sendEmail(
        email,
        mailOptions.subject,
        "",
        mailOptions.html,
        mailOptions.attachments
      );
      let statusCode = 500;
      if (emailres.success) {
        statusCode = 200;
      } else {
        statusCode = 404;
      }
      //unlink the generated file locally...
      if (outputPath) {
        Utilities.deleteAFile(outputPath);
      }
      res.send({ statusCode: statusCode, data: emailres });
    }
  });
});
//update Tenant details...
router.post("/updateTenant", async (req, res) => {
  try {
    console.log(`UpdateTenant ::`, req.body);

    const { _id, name, url, primary_color, secondary_color, updated_by, displayName, business_url, address, city, contact, country, state } =
      req.body;
    const query = { name: name };
    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { name: -1 },
      // Include only the `name` and `logo` fields in each returned document
      // projection: { _id: 1, name: 1, logo: 1 },
    };
    let tenant = {};
    if (name) tenant[`name`] = name;
    if (url) tenant[`url`] = url;
    if (primary_color) tenant[`primary_color`] = primary_color;
    if (secondary_color) tenant[`secondary_color`] = secondary_color;
    if (displayName) tenant['display_name'] = displayName;
    if (business_url) tenant['business_url'] = business_url;

    let tenat_address = {};
    if(address) tenat_address[`address`] = address;
    if(city) tenat_address[`city`] = city;
    if(state) tenat_address[`state`] = state;
    if(contact) tenat_address[`contact`] = contact;
    if(country) tenat_address[`country`] = country;

    const update_tenant = {
      ...tenant,
      updated_by: updated_by,
      updated_on: moment().format(),
    };
    const update_tenant_address = {
      ...tenat_address,
      updated_by: updated_by,
      updated_on: moment().format(),
    };
    console.log(update_tenant);
    const doc = await Tenant.findByIdAndUpdate(_id, update_tenant, {
      new: true,
    });
    if(doc){
      const document = await TenantAddress.findOneAndUpdate({tenant_id: _id}, update_tenant_address, {new: true});
    }
    if (doc._id) {
      Utilities.prepareAndSendAPIResponse(res, 200, doc, "success");
    } else {
      Utilities.prepareAndSendAPIResponse(
        res,
        200,
        {},
        `No record found against the tenant "${_id}"`
      );
    }
  } catch (err) {
    Utilities.prepareAndSendAPIResponse(
      res,
      404,
      {},
      err?.message ? err.message : "Failed to update"
    );
  }
});
// delete a tenant or tenants...
router.post("/deleteTenants", async (req, res) => {
  try {
    const { _ids, status, updated_by } = req.body;
    console.log("deleteItem action triggered", _ids, status);
    if (Array.isArray(_ids)) {

      await Tenant.updateMany(
        { _id: { $in: _ids } },
        {
          $set: {
            status: status,
            updated_by: updated_by,
            updated_on: moment().format(),
          },
        },
        { multi: true }
      );
      const updated_tenants = await Tenant.find({ _id: { $in: _ids } });
      //   .select({
      //     status: 1,
      //     _id: 1,
      //     tenant_id: 1,
      //     is_special: 1,
      //   });
      console.log(updated_tenants);
      Utilities.prepareAndSendAPIResponse(res, 200, updated_tenants, "success");
    } else {
      Utilities.prepareAndSendAPIResponse(
        res,
        404,
        [],
        "_ids - expected as an array"
      );
    }
  } catch (err) {
    Utilities.prepareAndSendAPIResponse(
      res,
      404,
      {},
      err?.message ? err.message : "deleteTenant:: Failed to update"
    );
  }
});

router.get("/getTotalDocuments", async (req, res) => {
  const result = await Tenant.countDocuments({ status: true })
  res.send({ data: result });
});

router.delete("/deleteAllTenantsByStatus", async (req, res) => {
  const { status, email } = req.query;
  console.log("hit delete route", req.query);
  // res.send({msg:"hit the delete route", "data": req.query});
  try {
    if (status || email) {
      /*
      dependency models...
      1. tenant      
      2. token
      3. items
      4. artifacts
      5. tenat_address
      */
      const filter = email ? { email: email } : { status: status };
      if (email) {
        const document = await Tenant.findOne(filter).select({ _id: 1, name: 1 });
        console.log(document._id);
        if (document) {
          const _idStr = document._id.toString();
          const _id = document._id;
        }
      }
      const deleteManyResult = await Tenant.deleteMany({});
      if (deleteManyResult) {
        console.log(`${deleteManyResult} Tenant document(s) deleted...`);
        const deleteManyItemsRes = await Item.deleteMany({});
        const deleteManyTenantAddressRes = await TenantAddress.deleteMany({});
        const filter = { email: { $nin: ["admin@stealdeals.com.au"] } }; // Replace with your field and values
        const result = await Token.deleteMany(filter);
        const arti_del_res = await Artifact.deleteMany({});
        if (arti_del_res)
          res.send({ message: "Deleted Successfully" });

      }

    }
  } catch (err) {
    console.error(err);
  }

});

router.post("/deleteById", async (req, res) => {
  try {
    const { _id } = req.body;
    console.log("deleteById:::", req.body)
    let filter = { _id: new Object(_id) };
    const document = await Tenant.findOne(filter).select({ _id: 1, name: 1 });
    if (document) {
      console.log(`Tenant document(s) deleted...`);
      filter = { tenant_id: _id };
      //findout all items related to the Teanat...     
      const items = await Item.find(filter).select({ _id: 1 });
      const ids = items.map(doc => doc._id);
      console.log("id list :: ", ids);
      const query = { item_id: { $in: ids } }
      const results = await Artifact.find(query).select({ _id: 1, title: 1 });
      //delete artifacts against results
      const dResults = await Artifact.deleteMany(query);
      console.log(`${dResults} Artifact document(s) deleted against ${ids}...`);
      const itemDResults = await Item.deleteMany(filter);
      console.log(`${itemDResults} Items document(s) deleted against tenant Id :: ${_id}, tenant Name: ${document.name}...`);
      const deleteManyTenantAddressRes = await TenantAddress.deleteMany(filter);
      console.log(`${deleteManyTenantAddressRes} TenantAddress document deleted against tenant Id :: ${_id}, tenant Name: ${document.name}...`);
      const result = await Token.deleteMany(filter);
      console.log(`${result} Token document deleted against tenant Id :: ${_id}, tenant Name: ${document.name}...`);
      const tenantDel = await Tenant.deleteOne({ _id: new Object(_id) })
      console.log(`Tenant document deleted against tenant Id :: ${_id}, tenant Name: ${document.name}...`)
      if (tenantDel) {
        const options = {
          // Sort returned documents in ascending order by title (A->Z)

          sort: { created_on: -1 },
          // Include only the `name` and `logo` fields in each returned document
          // projection: { _id: 0, name: 1, logo: 1 },
        };
        const updated_tenants = await Tenant.find({}, {}, options);
        Utilities.prepareAndSendAPIResponse(res, 200, updated_tenants, `Tenant "${document.name}" is Deleted Successfully`);
        // res.send({ message: `Tenant "${document.name}" is Deleted Successfully`, statusCode: 200 }).status(200);
      }
    }
  } catch (err) {
    console.log("Error Occurred in deleteById Route ::", error);
    Utilities.prepareAndSendAPIResponse(
      res,
      404,
      {},
      err?.message ? err.message : "deleteById:: Failed "
    );
  }
})
module.exports = router;
