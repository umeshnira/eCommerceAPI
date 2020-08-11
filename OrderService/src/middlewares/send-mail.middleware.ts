

export async function sendMailMiddleWare(order): Promise<any> {

    let middlebody = '';
    let totalPrice = 0;


    const upperBody = `<table width="600" border="1" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="text-align:left">
    <tbody>
        <tr>
            <td width="20" style="border-top:none;border-left:none;border-right:none"></td>
            <td style="border-top:none;border-left:none;border-right:none">
                <table width="100%">
                    <tbody><tr>
                        <td width="200" style="font-size:18px;color:#333;font-weight:bold;line-height:54px">Order detail</td>

                    </tr>
                </tbody></table>
            </td>
            <td width="20" style="border-top:none;border-left:none;border-right:none"></td>
        </tr>
                                <tr>
            <td width="20" style="border-top:none;border-bottom:none;border-left:none;border-right:none"></td>
            <td style="border-top:none;border-left:none;border-right:none">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tbody>`;

    order.forEach(x => {
        middlebody = middlebody + `<tr>
                        <td width="10"></td>
                        <td width="100" height="116" style="font-size:18px;color:#333;line-height:54px"><img style="vertical-align:middle" src="http://placehold.it/120x120&text=image4" border="0" height="80" width="80" ></td>
                        <td style="font-size:14px;color:#333">
                            <p style="font-size:14px;color:#666;font-weight:bold;margin:0">${x.name}</p>
                            <p style="font-size:14px;color:#666;margin:0;line-height:30px">₹ ${x.price} X ${x.qty} = ₹ ${x.price * x.qty}</p>
                        </td>
                    </tr>`
        totalPrice = totalPrice + (x.price * x.qty)
    });
    const bottomBoady = `</tbody></table>
                    </td>
                    <td width="20" style="border-top:none;border-bottom:none;border-left:none;border-right:none"></td>
                </tr>

                <tr>
                    <td width="20" style="border-top:none;border-left:none;border-right:none"></td>
                    <td style="border-top:none;border-left:none;border-right:none">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody><tr>
                                <td height="10">
                            </td></tr>
                            <tr>
                                <td style="font-size:14px;color:#666;line-height:30px">
                                    <span style="margin-right:10px"><strong>Subtotal:</strong> ₹ ${totalPrice}</span>
                                    <span><strong>

                                    </strong></span>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;color:#666;line-height:30px">
                                    <span style="margin-right:10px"><strong>Shipping:</strong> ₹0</span>

                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:18px;color:#ee330a;line-height:30px">
                                    <strong>Total:</strong> ₹ ${totalPrice}                                       </td>
                            </tr>
                            <tr>
                                <td height="10">
                            </td></tr>
                        </tbody></table>
                    </td>
                    <td width="20" style="border-top:none;border-left:none;border-right:none"></td>
                </tr>
                                        <tr>
                    <td width="20" style="border-top:none;border-bottom:none;border-left:none;border-right:none"></td>
                    <td style="border-top:none;border-bottom:none;border-left:none;border-right:none">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody><tr>
                                <td height="10">
                            </td></tr>
                            <tr>
                                <td colspan="2" style="font-size:18px;color:#333;font-weight:bold;line-height:50px">Delivery information</td>
                            </tr>
                            <tr>
                                <td valign="top" width="80" style="font-size:14px;color:#666;line-height:24px;font-weight:bold">Name:</td>
                                <td valign="top" style="font-size:14px;color:#666;line-height:24px">${order[0].full_name}</td>
                            </tr>
                            <tr>
                                <td valign="top" style="font-size:14px;color:#666;line-height:24px;font-weight:bold">Phone:</td>
                                <td valign="top" style="font-size:14px;color:#666;line-height:24px">
                                ${order[0].phone}                                        </td>
                            </tr>
                            <tr>
                                <td valign="top" style="font-size:14px;color:#666;line-height:24px;font-weight:bold">Address:</td>
                                <td valign="top" style="font-size:14px;color:#666;line-height:24px">
                                ${order[0].address}                                  </td>
                            </tr>
                            <tr>
                                <td height="20"></td>
                            </tr>
                            <tr>
                                <td colspan="2" style="font-size:14px;color:#666;line-height:24px">
                                    *Package will be delivered between 09:00-19:00 from Monday to Saturday. There are no deliveries on Sunday and on public holidays.
                                </td>
                            </tr>
                            <tr>
                                <td height="20">
                            </td></tr>
                        </tbody></table>
                    </td>
                    <td width="20" style="border-top:none;border-bottom:none;border-left:none;border-right:none"></td>
                </tr>
                                    </tbody>
        </table>`



    return upperBody + middlebody + bottomBoady;


};