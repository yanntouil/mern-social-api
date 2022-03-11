

export default (body: string) => `
<div style="font-family: 'Roboto', Arial, sans-serif; font-size: 14px; margin: 0; padding: 0;">
    <table bgcolor="#272e2f" cellpadding="0" cellspacing="0" border="0" width="100%;" style="border-collapse: collapse; max-width: 740px; width: 100%; border-left: 1px solid #ececec; border-right: 1px solid #ececec; direction: ltr; text-align: left;">
        <tbody>
            <tr>
                <td bgcolor="#272e2f" height="35" style="font-size: 1px">
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td bgcolor="#272e2f" height="55" style="vertical-align: top; padding-left: 7%; padding-right: 7%; color: white;" border="0">
                    LOGO
                </td>
            </tr>
        </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" width="100%;" style="border-collapse: collapse; border-left: 1px solid #ececec; border-right: 1px solid #ececec; max-width: 740px; width: 100%; direction: ltr; text-align: left;">
        <tbody>
            <tr>
                <td style="padding-top: 20px">
                    <table>
                        <tbody>
                            <tr>
                                <td width="20" style="width: 20px" bgcolor="#FFFFFF"></td>
                                <td bgcolor="#FFFFFF" width="100%" style="width: 100%; background: #ffffff; background-color: #ffffff; padding-left: 7%; padding-right: 7%;">
                                    ${body}
                                    <br />
                                    <br />
                                </td>
                                <td width="20" bgcolor="#FFFFFF" style="width: 20px; background: #ffffff no-repeat right bottom;"></td>
                            </tr>
                        </tbody>
                    </table>
                    <table bgcolor="#f6f6f6" cellpadding="0" cellspacing="0" border="0" width="100%;" style="border-collapse: collapse; max-width: 740px; width: 100%; direction: ltr; text-align: left;">
                        <tbody>
                            <tr>
                                <td bgcolor="#f6f6f6" style="vertical-align: top; padding-left: 7%; padding-right: 7%; padding-bottom: 6px; padding-top: 6px;" border="0">
                                    <font face="Arial, sans-serif" color="#666666" size="2" style="font-size: 0px; line-height: 20px;">
                                        <div style="display: inline-block; font-size: 15px; width: 30%; padding-right: 3%; vertical-align: top; text-align: center;">
                                            Footer link 1
                                        </div>
                                        <div style="display: inline-block; font-size: 15px; width: 30%; padding-right: 3%; vertical-align: top; text-align: center;">
                                            Footer link 2
                                        </div>
                                        <div style="display: inline-block; font-size: 15px; width: 30%; padding-right: 3%; vertical-align: top; text-align: center;">
                                            Footer link 3
                                        </div>
                                    </font>
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td height="15" style="font-size: 1px; background: #eceded">
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td style="background: #eceded; color: #666666; font-size: 12px; font-family: Arial, sans-serif; line-height: 18px; padding-left: 7%; padding-right: 7%; direction: ltr;"></td>
            </tr>
            <tr>
                <td height="15" style="font-size: 1px; background: #eceded">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" width="100%;" style="max-width: 740px; width: 100%; direction: ltr; text-align: left;">
        <tbody>
            <tr>
                <td style="padding-left: 7%; padding-right: 7%">
                    <br />
                    <p style="font-size: 12px; color: #adadad">
                        Footer bottom mention
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`