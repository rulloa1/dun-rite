/* Longleaf Amenity Bids — DunRite Construction Group */
window.PROJECT = (function(){
  const usd = n => '$' + Math.round(n).toLocaleString('en-US');
  const bids = [
    {id:1, vendor:'Gontry',              trade:'Lathe / Plaster',                    status:'Done', amt:12555.00},
    {id:2, vendor:'Keving Barnes',       trade:'Flooring',                           status:'Done', amt:17000.00},
    {id:3, vendor:'Brad Ball',           trade:'H20 Plumbing',                       status:'Done', amt:14720.00},
    {id:'3.a', vendor:'Brad Ball',       trade:'H20 Sewer Connect up to 50\'',       status:'Done', amt:720.00},
    {id:4, vendor:'Robert Greene Drywa', trade:'Drywall',                            status:'Done', amt:5510.00},
    {id:5, vendor:'EMT Electric',        trade:'Electric',                           status:'Done', amt:44476.73},
    {id:6, vendor:'American Pools',      trade:'Pool Construction',                  status:'Done', amt:434630.00},
    {id:9, vendor:'Chris Hensley',       trade:'Insulation Core Foam Drum Set',      status:'Done', amt:6747.00},
    {id:11, vendor:'Scotty Doo',         trade:'Trade TBD',                          status:'Not Returned', amt:0},
    {id:12, vendor:'Justin Mack',        trade:'MackCore Services',                  status:'Not Returned', amt:0},
    {id:13, vendor:'Paul',               trade:'Landscape',                          status:'Not Returned', amt:91495.00},
    {id:14, vendor:'Keeler Fence',       trade:'Fencing',                            status:'Done', amt:34214.99},
    {id:15, vendor:'Dwayne Hardin',      trade:'San Antonio Lumber Door Window',     status:'Not Returned', amt:0},
  ];
  
  const total = bids.reduce((a,b)=>a+b.amt,0);
  const returned = bids.filter(b=>b.status==='Done').length;
  const notReturned = bids.filter(b=>b.status==='Not Returned').length;
  
  return {
    name:'Longleaf Amenity',
    location:'San Antonio, TX',
    client:'Longleaf Development',
    total, returned, notReturned, bids, usd
  };
})();
